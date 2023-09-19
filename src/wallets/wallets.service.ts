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
}
