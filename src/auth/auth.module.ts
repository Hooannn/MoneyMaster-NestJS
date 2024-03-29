import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import config from 'src/configs';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    UsersModule,
    RedisModule,
    JwtModule.register({
      global: false,
      secret: config.JWT_AUTH_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
