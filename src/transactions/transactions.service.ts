import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { InjectKnex } from 'nestjs-knex';
import { Knex } from 'knex';
import { TransactionFiles } from './entities/transaction_files.entity';
import { WalletsService } from 'src/wallets/wallets.service';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { TransactionType } from 'src/categories/entities/category.entity';
import { CategoriesService } from 'src/categories/categories.service';
@Injectable()
export class TransactionsService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private readonly walletsService: WalletsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async clear() {
    try {
      return await this.knex<Transaction>('transactions').del();
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async create(createTransactionDto: CreateTransactionDto, createdBy: number) {
    try {
      await this.validateWallet(createdBy, createTransactionDto.wallet_id);
      const fileIds = createTransactionDto.file_ids;
      delete createTransactionDto.file_ids;
      const [res] = await this.knex<Transaction>('transactions').insert(
        {
          ...createTransactionDto,
          updated_by: createdBy,
          created_by: createdBy,
        },
        '*',
      );

      if (fileIds && fileIds.length) {
        const transactionFiles = fileIds.map((fileId) => ({
          file_id: fileId,
          transaction_id: res.id,
        }));
        await this.knex<TransactionFiles>('transaction_files').insert(
          transactionFiles,
        );
      }

      await this.updateWalletBalance(res);

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const res = await this.knex<Transaction>('transactions').select();
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.knex<Transaction>('transactions')
        .where('id', id)
        .first();

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
    updatedBy: number,
  ) {
    try {
      const currentTransaction = await this.findOne(id);
      await this.validateWallet(updatedBy, currentTransaction.wallet_id);
      await this.revertWalletBalance(currentTransaction);

      const fileIds = updateTransactionDto.file_ids;
      delete updateTransactionDto.file_ids;
      const [res] = await this.knex<Transaction>('transactions')
        .where('id', id)
        .update({ ...updateTransactionDto, updated_by: updatedBy }, '*');

      if (fileIds && fileIds.length) {
        await this.knex<TransactionFiles>('transaction_files')
          .where('transaction_id', res.id)
          .del();
        await this.knex<TransactionFiles>('transaction_files').insert(
          fileIds.map((fileId) => ({
            file_id: fileId,
            transaction_id: res.id,
          })),
        );
      }

      await this.updateWalletBalance(res);

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const [res] = await this.knex<Transaction>('transactions')
        .where('id', id)
        .del('*');

      await this.revertWalletBalance(res);

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  private async validateWallet(
    userId: number,
    walletId: number,
  ): Promise<Wallet> {
    const wallet = await this.walletsService.findOne(walletId);
    const isValid = wallet.belongs_to === userId;
    if (!isValid) throw new ForbiddenException();
    return wallet;
  }

  private async revertWalletBalance(transaction: Transaction) {
    const category = await this.categoriesService.findOne(
      transaction.category_id,
    );
    const transactionType = category?.transaction_type;
    const walletId = transaction.wallet_id;
    const amount = transaction.amount_in_usd;
    switch (transactionType) {
      case TransactionType.Expense:
        await this.walletsService.deposit(walletId, amount);
        break;
      case TransactionType.Income:
        await this.walletsService.withdraw(walletId, amount);
        break;
    }
  }

  private async updateWalletBalance(transaction: Transaction) {
    const category = await this.categoriesService.findOne(
      transaction.category_id,
    );
    const transactionType = category?.transaction_type;
    const walletId = transaction.wallet_id;
    const amount = transaction.amount_in_usd;
    switch (transactionType) {
      case TransactionType.Expense:
        await this.walletsService.withdraw(walletId, amount);
        break;
      case TransactionType.Income:
        await this.walletsService.deposit(walletId, amount);
        break;
    }
  }
}
