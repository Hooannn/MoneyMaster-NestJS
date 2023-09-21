import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectKnex } from 'nestjs-knex';
import { Knex } from 'knex';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletsService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(createWalletDto: CreateWalletDto, createdBy: number) {
    try {
      const [res] = await this.knex<Wallet>('wallets').insert(
        {
          ...createWalletDto,
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
      const res = await this.knex<Wallet>('wallets').select();
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.knex<Wallet>('wallets').where('id', id).first();

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneUserWallet(userId: number) {
    try {
      const res = await this.knex<Wallet>('wallets')
        .where('belongs_to', userId)
        .first();

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    id: number,
    updateWalletDto: UpdateWalletDto,
    updatedBy: number,
  ) {
    try {
      const [res] = await this.knex<Wallet>('wallets')
        .where('id', id)
        .update({ ...updateWalletDto, updated_by: updatedBy }, '*');

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const [res] = await this.knex<Wallet>('wallets').where('id', id).del('*');
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async deposit(walletId: number, amount: number) {
    return await this.knex<Wallet>('wallets')
      .where('id', walletId)
      .increment('amount_in_usd', amount);
  }

  async withdraw(walletId: number, amount: number) {
    return await this.knex<Wallet>('wallets')
      .where('id', walletId)
      .decrement('amount_in_usd', amount);
  }

  async createDefaultWallet(userId: number) {
    return await this.create(
      {
        name: 'Default wallet',
        description: "This is a default user's wallet",
        amount_in_usd: 0,
        wallet_policy_id: 1,
        wallet_type_id: 1,
        belongs_to: userId,
      },
      userId,
    );
  }
}
