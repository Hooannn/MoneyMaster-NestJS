import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { Knex as KnexModule } from './database';
import { NotificationsModule } from './notifications/notifications.module';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { MailerService } from './mailer/mailer.service';

@Module({
  imports: [
    UsersModule,
    KnexModule,
    NotificationsModule,
    LoggerModule.forRoot(),
    AuthModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailerService],
})
export class AppModule {}
