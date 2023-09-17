import {
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { generatePassword } from 'src/utils/password';
import Redis from 'ioredis';
import { hashSync, compareSync } from 'bcrypt';
import config from 'src/configs';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { registerTemplate } from 'src/mailer/templates/password';
import { RefreshDto } from './dto/refresh-dto';
import { HttpService } from '@nestjs/axios';
import { Role } from './auth.roles';

export interface JwtPayloads {
  userId: string;
  roles: [Role];
}

@Injectable()
export class AuthService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    @Inject('REDIS') private readonly redisClient: Redis,
    private usersService: UsersService,
    private mailerService: MailerService,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async signIn(signInDto: SignInDto) {
    try {
      const requestUser = await this.usersService.findPassword(signInDto.email);
      if (!requestUser)
        throw new HttpException('Unregistered email address', 400);
      const isPasswordMatched = compareSync(
        signInDto.password?.toString(),
        requestUser.password?.toString(),
      );
      const authenticatedUser = await this.usersService.findOne(requestUser.id);
      if (!isPasswordMatched)
        throw new UnauthorizedException('Invalid password');

      const { access_token, refresh_token } = await this.getCredentials(
        authenticatedUser.id,
        authenticatedUser.roles,
      );

      return {
        user: authenticatedUser,
        credentials: { access_token, refresh_token },
      };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async signInWithRenewPassword(signInDto: SignInDto) {
    try {
      const user = await this.usersService.findOneByEmail(signInDto.email);
      if (!user) throw new HttpException('Unregistered email address', 400);
      const generatedPassword = await this.redisClient.get(
        `email:${signInDto.email}`,
      );
      const isPasswordMatched =
        parseInt(generatedPassword) === signInDto.password;

      if (!isPasswordMatched)
        throw new UnauthorizedException('Invalid password');

      const newHashedPassword = hashSync(
        generatedPassword,
        parseInt(config.SALTED_PASSWORD),
      );

      const { access_token, refresh_token } = await this.getCredentials(
        user.id,
        user.roles,
      );

      this.usersService.update(user.id, {
        password: newHashedPassword,
      });

      return { user, credentials: { access_token, refresh_token } };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async createPassword(params: { email: string }) {
    try {
      const generatedPassword = generatePassword();
      return Promise.all([
        this.sendGeneratedPasswordMail(params.email, generatedPassword),
        this.redisClient.setex(
          `email:${params.email}`,
          parseInt(config.PASSWORD_LIFE),
          generatedPassword,
        ),
      ]);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async signUp(signUpDto: SignUpDto) {
    try {
      const user = await this.usersService.findOneByEmail(signUpDto.email);
      if (user) throw new HttpException('Registered email address', 400);
      const generatedPassword = await this.redisClient.get(
        `email:${signUpDto.email}`,
      );
      const isPasswordMatched =
        parseInt(generatedPassword) === signUpDto.password;

      if (!isPasswordMatched)
        throw new UnauthorizedException(`Invalid password`);

      const hashedPassword = hashSync(
        signUpDto.password.toString(),
        parseInt(config.SALTED_PASSWORD),
      );

      const createdUser = await this.usersService.create({
        email: signUpDto.email,
        password: hashedPassword,
        first_name: '',
        last_name: '',
      });

      const { access_token, refresh_token } = await this.getCredentials(
        createdUser.id,
        user.roles,
      );

      return {
        user: createdUser,
        credentials: { access_token, refresh_token },
      };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async refresh(refreshDto: RefreshDto) {
    try {
      const requestToken = refreshDto.refreshToken;
      const tokenPayload = this.jwtService.decode(requestToken) as JwtPayloads;
      const belongsTo = tokenPayload?.userId;
      if (!belongsTo) throw new UnauthorizedException('Invalid refresh token');
      const legalToken = await this.redisClient.get(
        `refresh_token:${belongsTo}`,
      );
      await this.jwtService.verifyAsync(legalToken, {
        secret: config.REFRESH_TOKEN_SECRET,
      });
      const legalUser = await this.usersService.findOne(parseInt(belongsTo));
      const { access_token, refresh_token } = await this.getCredentials(
        legalUser.id,
        legalUser.roles,
      );
      return { credentials: { access_token, refresh_token } };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async performAuthenWithGoogleProvider(googleAccessToken: string) {
    const googleUser = await this.getPublicGoogleUser(googleAccessToken);
    const { email_verified, family_name, given_name, email, picture } =
      googleUser;
    if (!email_verified) throw new UnauthorizedException('Email not verified');
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const { access_token, refresh_token } = await this.getCredentials(
        user.id,
        user.roles,
      );
      return {
        user,
        credentials: { access_token, refresh_token },
      };
    } else {
      const password = generatePassword().toString();
      const hashedPassword = hashSync(
        password,
        parseInt(config.SALTED_PASSWORD),
      );

      const createdUser = await this.usersService.create({
        email,
        password: hashedPassword,
        first_name: family_name,
        last_name: given_name,
        avatar: picture,
      });

      const { access_token, refresh_token } = await this.getCredentials(
        createdUser.id,
        createdUser.roles,
      );

      return {
        user: createdUser,
        credentials: { access_token, refresh_token },
      };
    }
  }

  private async getPublicGoogleUser(googleAccessToken: string) {
    try {
      const { data } = await this.httpService.axiosRef.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        },
      );
      return data;
    } catch (error) {
      throw new UnauthorizedException('Invalid google access token');
    }
  }

  private async getCredentials(
    userId: string,
    roles: [Role],
  ): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const access_token = this.generateAccessToken(userId, roles);
    const refresh_token = this.generateRefreshToken(userId);
    await this.redisClient.setex(
      `refresh_token:${userId}`,
      parseInt(config.REFRESH_TOKEN_LIFE),
      refresh_token,
    );
    return { access_token, refresh_token };
  }

  private generateAccessToken(userId: string, roles: [Role]) {
    return this.jwtService.sign(
      { userId, roles },
      {
        secret: config.ACCESS_TOKEN_SECRET,
        expiresIn: config.ACCESS_TOKEN_LIFE,
      },
    );
  }

  private generateRefreshToken(userId: string) {
    return this.jwtService.sign(
      { userId },
      {
        secret: config.REFRESH_TOKEN_SECRET,
        expiresIn: config.REFRESH_TOKEN_LIFE_D,
      },
    );
  }

  private async sendMail(mailOptions: ISendMailOptions) {
    return this.mailerService.sendMail(mailOptions);
  }

  private async sendGeneratedPasswordMail(email: string, password: number) {
    const mailOptions: ISendMailOptions = {
      to: email,
      subject: 'Register account - Money Master',
      html: registerTemplate(password),
    };
    return await this.sendMail(mailOptions);
  }
}
