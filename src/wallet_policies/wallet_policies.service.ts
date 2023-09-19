import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWalletPolicyDto } from './dto/create-wallet_policy.dto';
import { UpdateWalletPolicyDto } from './dto/update-wallet_policy.dto';
import { InjectKnex } from 'nestjs-knex';
import { Knex } from 'knex';
import { WalletPolicy } from './entities/wallet_policy.entity';

@Injectable()
export class WalletPoliciesService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(
    createWalletPolicyDto: CreateWalletPolicyDto,
    createdBy: number,
  ) {
    try {
      const [res] = await this.knex<WalletPolicy>('wallet_policies').insert(
        {
          ...createWalletPolicyDto,
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
      const res = await this.knex<WalletPolicy>('wallet_policies').select();
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.knex<WalletPolicy>('wallet_policies')
        .where('id', id)
        .first();

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    id: number,
    updateWalletPolicyDto: UpdateWalletPolicyDto,
    updatedBy: number,
  ) {
    try {
      const [res] = await this.knex<WalletPolicy>('wallet_policies')
        .where('id', id)
        .update({ ...updateWalletPolicyDto, updated_by: updatedBy }, '*');

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const [res] = await this.knex<WalletPolicy>('wallet_policies')
        .where('id', id)
        .del('*');
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
