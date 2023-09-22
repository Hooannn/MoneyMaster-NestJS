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
import { QueryDto } from 'src/query.dto';
@Injectable()
export class TransactionsService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private readonly walletsService: WalletsService,
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
      await this.walletsService.findValidWallet(
        createTransactionDto.wallet_id,
        createdBy,
      );

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

      await this.walletsService.updateWalletBalance(res);

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: QueryDto) {
    try {
      const [res, counter] = await Promise.all([
        this.knex<Transaction>('transactions')
          .offset(query.offset)
          .limit(query.limit),
        this.knex<Transaction>('transactions').count('id'),
      ]);

      return {
        data: res as Transaction[],
        total: counter[0]?.count,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findValidTransactions(query: QueryDto, requestedBy: number) {
    try {
      const [res, counter] = await Promise.all([
        this.knex<Transaction>('transactions')
          .select(
            'transactions.*',
            'categories.name as category_name',
            'categories.transaction_type as transaction_type',
          )
          .leftJoin('categories', 'transactions.category_id', 'categories.id')
          .where('transactions.created_by', requestedBy)
          .orderBy('transactions.id')
          .limit(query.limit)
          .offset(query.offset),
        this.knex<Transaction>('transactions')
          .where('transactions.created_by', requestedBy)
          .count('id'),
      ]);

      return {
        data: res as Transaction[],
        total: counter[0]?.count,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findValidTransactionsByWalletId(
    query: QueryDto,
    requestedBy: number,
    walletId: number,
  ) {
    try {
      const [res, counter] = await Promise.all([
        this.knex<Transaction>('transactions')
          .select(
            'transactions.*',
            'categories.name as category_name',
            'categories.transaction_type as transaction_type',
          )
          .leftJoin('categories', 'transactions.category_id', 'categories.id')
          .where('transactions.created_by', requestedBy)
          .andWhere('transactions.wallet_id', walletId)
          .orderBy('transactions.id')
          .limit(query.limit)
          .offset(query.offset),
        this.knex<Transaction>('transactions')
          .where('created_by', requestedBy)
          .andWhere('wallet_id', walletId)
          .count('id'),
      ]);

      return {
        data: res as Transaction[],
        total: counter[0]?.count,
      };
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

  async findValidTransaction(transactionId: number, requestedBy: number) {
    const res = await this.knex<Transaction>('transactions')
      .where('id', transactionId)
      .andWhere('created_by', requestedBy)
      .first();

    if (!res) throw new ForbiddenException();
    return res;
  }

  async update(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
    updatedBy: number,
  ) {
    try {
      const currentTransaction = await this.findValidTransaction(id, updatedBy);

      await this.walletsService.findValidWallet(
        currentTransaction.wallet_id,
        updatedBy,
      );

      await this.walletsService.revertWalletBalance(currentTransaction);

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

      await this.walletsService.updateWalletBalance(res);

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number, requestedBy: number) {
    try {
      const [res] = await this.knex<Transaction>('transactions')
        .where('id', id)
        .andWhere('created_by', requestedBy)
        .del('*');

      if (!res) throw new ForbiddenException();

      await this.walletsService.revertWalletBalance(res);

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
