import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { InjectKnex } from 'nestjs-knex';
import { Knex } from 'knex';
import { TransactionFiles } from './entities/transaction_files.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
@Injectable()
export class TransactionsService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    @InjectQueue('transactions') private transactionsQueue: Queue,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, createdBy: number) {
    try {
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

      this.transactionsQueue.add('transaction.created', {
        object: res,
      });
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

      this.transactionsQueue.add('transaction.updated', {
        object: res,
      });
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      //TODO; automatically remove transaction_file when transaction is deleted
      await this.knex<TransactionFiles>('transaction_files')
        .where('transaction_id', id)
        .del();

      const [res] = await this.knex<Transaction>('transactions')
        .where('id', id)
        .del('*');

      this.transactionsQueue.add('transaction.deleted', {
        object: res,
      });
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
