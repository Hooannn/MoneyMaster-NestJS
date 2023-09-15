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
@Injectable()
export class AuthService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    @Inject('REDIS') private readonly redisClient: Redis,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async checkUser(params: { email: string }) {
    try {
      const user = await this.knex
        .table('users')
        .select('first_name', 'last_name', 'id', 'email')
        .where({ email: params.email })
        .first();
      return user;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async signIn(signInDto: SignInDto) {
    try {
      const user = await this.usersService.findOneByEmail(signInDto.email);
      if (!user) throw new HttpException('Unregistered email address', 400);
      const isValidPassword = user.password === signInDto.password;
      if (!isValidPassword) throw new UnauthorizedException('Invalid password');
      return user;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async createPassword({ email: string }) {
    const generatedPassword = generatePassword();
  }

  async signUp(signUpDto: SignUpDto) {
    try {
      const user = await this.usersService.findOneByEmail(signUpDto.email);
      if (user) throw new HttpException('Registered email address', 400);
      return user;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
