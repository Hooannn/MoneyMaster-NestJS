import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckUserDto } from './dto/check-user.dto';
import { isEmail } from 'class-validator';
import ResponseBuilder from 'src/utils/response';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  private readonly responseBuilder = new ResponseBuilder<any>();
  constructor(private readonly authService: AuthService) {}

  @Get()
  async checkUser(@Query() checkUserDto: CheckUserDto) {
    const email = Buffer.from(checkUserDto.email, 'base64').toString('ascii');
    if (!isEmail(email)) {
      throw new HttpException('Invalid email address', HttpStatus.BAD_REQUEST);
    }
    const user = await this.authService.checkUser({ email });
    if (!user) {
      throw new HttpException(
        'Unregistered email address',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.responseBuilder
      .code(200)
      .success(true)
      .data(user)
      .message('Available user')
      .build();
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    const user = await this.authService.signIn(signInDto);
    return this.responseBuilder
      .code(200)
      .success(true)
      .data(user)
      .message('Signed in successfully')
      .build();
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.authService.signUp(signUpDto);
    return this.responseBuilder
      .code(200)
      .success(true)
      .data(user)
      .message('Signed up successfully')
      .build();
  }
}
