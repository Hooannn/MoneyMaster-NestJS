import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { Knex as KnexModule } from './database';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { NotificationsModule } from './notifications/notifications.module';
import { LoggerModule } from 'nestjs-pino';
@Module({
  imports: [
    UsersModule,
    KnexModule,
    PostsModule,
    CategoriesModule,
    NotificationsModule,
    LoggerModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
