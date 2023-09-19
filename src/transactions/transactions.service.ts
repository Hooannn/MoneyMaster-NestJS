import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { InjectKnex } from 'nestjs-knex';
import { Knex } from 'knex';
@Injectable()
export class TransactionsService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(createTransactionDto: CreateTransactionDto, createdBy: number) {
    try {
      const [res] = await this.knex<Transaction>('transactions').insert(
        {
          ...createTransactionDto,
          updated_by: createdBy,
          created_by: createdBy,
        },
        '*',
      );
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
      const [res] = await this.knex<Transaction>('transactions')
        .where('id', id)
        .update({ ...updateTransactionDto, updated_by: updatedBy }, '*');

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
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
