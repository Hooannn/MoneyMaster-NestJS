import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWalletTypeDto } from './dto/create-wallet_type.dto';
import { UpdateWalletTypeDto } from './dto/update-wallet_type.dto';
import { InjectKnex } from 'nestjs-knex';
import { Knex } from 'knex';
import { WalletType } from './entities/wallet_type.entity';

@Injectable()
export class WalletTypesService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(createWalletTypeDto: CreateWalletTypeDto, createdBy: number) {
    try {
      const [res] = await this.knex<WalletType>('wallet_types').insert(
        {
          ...createWalletTypeDto,
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
      const res = await this.knex<WalletType>('wallet_types').select();
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.knex<WalletType>('wallet_types')
        .where('id', id)
        .first();

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    id: number,
    updateWalletTypeDto: UpdateWalletTypeDto,
    updatedBy: number,
  ) {
    try {
      const [res] = await this.knex<WalletType>('wallet_types')
        .where('id', id)
        .update({ ...updateWalletTypeDto, updated_by: updatedBy }, '*');

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const [res] = await this.knex<WalletType>('wallet_types')
        .where('id', id)
        .del('*');
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
