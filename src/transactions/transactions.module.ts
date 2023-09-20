import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { BullModule } from '@nestjs/bull';
import { WalletsModule } from 'src/wallets/wallets.module';
import { TransactionsConsumer } from './transactions.processor';

@Module({
  imports: [
    WalletsModule,
    BullModule.registerQueue({
      name: 'transactions',
    }),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsConsumer],
})
export class TransactionsModule {}
