import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AdminCreateWalletDto, CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectKnex } from 'nestjs-knex';
import { Knex } from 'knex';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { TransactionType } from 'src/categories/entities/category.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { QueryDto } from 'src/query.dto';
import { AccountBase } from 'plaid';

@Injectable()
export class WalletsService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createWalletDto: CreateWalletDto, createdBy: number) {
    try {
      const [res] = await this.knex<Wallet>('wallets').insert(
        {
          ...createWalletDto,
          belongs_to: createdBy,
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

  async adminCreate(createWalletDto: AdminCreateWalletDto, createdBy: number) {
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

  async findAll(query: QueryDto) {
    try {
      const [res, counter] = await Promise.all([
        this.knex<Wallet>('wallets').offset(query.offset).limit(query.limit),
        this.knex<Wallet>('wallets').count('id'),
      ]);

      return {
        data: res,
        total: counter[0]?.count,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAllValidWallets(query: QueryDto, requestedBy: number) {
    try {
      const [res, counter] = await Promise.all([
        this.knex<Wallet>('wallets')
          .where('belongs_to', requestedBy)
          .offset(query.offset)
          .limit(query.limit),
        this.knex<Wallet>('wallets')
          .where('belongs_to', requestedBy)
          .count('id'),
      ]);

      return {
        data: res,
        total: counter[0]?.count,
      };
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

  async findValidWallet(walletId: number, requestedBy: number) {
    const res = await this.knex<Wallet>('wallets')
      .where('id', walletId)
      .andWhere('belongs_to', requestedBy)
      .first();

    if (!res) throw new ForbiddenException();

    return res;
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
        .andWhere('belongs_to', updatedBy)
        .update({ ...updateWalletDto, updated_by: updatedBy }, '*');

      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async adminUpdate(
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

  async remove(id: number, requestedBy: number) {
    try {
      const [res] = await this.knex<Wallet>('wallets')
        .where('id', id)
        .andWhere('belongs_to', requestedBy)
        .del('*');
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async adminRemove(id: number) {
    try {
      const [res] = await this.knex<Wallet>('wallets').where('id', id).del('*');
      return res;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  private async deposit(walletId: number, amount: number, requestedBy: number) {
    return await this.knex<Wallet>('wallets')
      .where('id', walletId)
      .andWhere('belongs_to', requestedBy)
      .increment('amount_in_usd', amount);
  }

  private async withdraw(
    walletId: number,
    amount: number,
    requestedBy: number,
  ) {
    return await this.knex<Wallet>('wallets')
      .where('id', walletId)
      .andWhere('belongs_to', requestedBy)
      .decrement('amount_in_usd', amount);
  }

  async createDefaultWallet(userId: number) {
    return await this.create(
      {
        name: 'Default wallet',
        description: "This is a default user's wallet",
        amount_in_usd: 0,
        wallet_type_id: 1,
      },
      userId,
    );
  }

  async revertWalletBalance(transaction: Transaction) {
    const category = await this.categoriesService.findOne(
      transaction.category_id,
    );
    const transactionType = category?.transaction_type;
    const walletId = transaction.wallet_id;
    const amount = transaction.amount_in_usd;
    switch (transactionType) {
      case TransactionType.Expense:
        await this.deposit(walletId, amount, transaction.created_by);
        break;
      case TransactionType.Income:
        await this.withdraw(walletId, amount, transaction.created_by);
        break;
    }
  }

  async updateWalletBalance(transaction: Transaction) {
    const category = await this.categoriesService.findOne(
      transaction.category_id,
    );
    const transactionType = category?.transaction_type;
    const walletId = transaction.wallet_id;
    const amount = transaction.amount_in_usd;
    switch (transactionType) {
      case TransactionType.Expense:
        await this.withdraw(walletId, amount, transaction.created_by);
        break;
      case TransactionType.Income:
        await this.deposit(walletId, amount, transaction.created_by);
        break;
    }
  }

  async createPlaidWallets(plaidAccounts: AccountBase[], userId: number) {
    const checkExistAndCreate = async (account: AccountBase) => {
      const existed = await this.knex<Wallet>('wallets')
        .select('id')
        .where('belongs_to', userId)
        .andWhereRaw("attrs->>'plaid_account_id' = ?", account.account_id)
        .first();
      if (existed) return existed;
      const [newWallet] = await this.knex<Wallet>('wallets').insert(
        {
          name: account.name,
          description: account.official_name,
          belongs_to: userId,
          wallet_type_id: 2,
          currency_code: account.balances?.iso_currency_code ?? 'USD',
          amount_in_usd: account.balances?.available ?? 0,
          attrs: {
            plaid_account_id: account.account_id,
          },
        },
        'id',
      );
      return newWallet;
    };

    return await Promise.all(
      plaidAccounts.map((account) => checkExistAndCreate(account)),
    );
  }
}
