import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RedisModule } from 'src/redis/redis.module';
import { WalletsModule } from 'src/wallets/wallets.module';
import { BullModule } from '@nestjs/bull';
import { UsersConsumer } from './users.processor';
@Module({
  imports: [
    RedisModule,
    WalletsModule,
    BullModule.registerQueue({
      name: 'users',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersConsumer],
  exports: [UsersService],
})
export class UsersModule {}
