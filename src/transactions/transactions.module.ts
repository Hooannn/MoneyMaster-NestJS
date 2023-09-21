import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { WalletsModule } from 'src/wallets/wallets.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [WalletsModule, CategoriesModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
