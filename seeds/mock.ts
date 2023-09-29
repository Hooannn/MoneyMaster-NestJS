import { Knex } from 'knex';
import { Role } from '../src/auth/auth.roles';
import { CreateCategoryDto } from '../src/categories/dto/create-category.dto';
import {
  Category,
  TransactionType,
} from '../src/categories/entities/category.entity';
import { CategoryGroup } from '../src/category_groups/entities/category_group.entity';
import { User } from '../src/users/entities/user.entity';
import { WalletPolicy } from '../src/wallet_policies/entities/wallet_policy.entity';
import { WalletType } from '../src/wallet_types/entities/wallet_type.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { faker } from '@faker-js/faker';
export async function seed(knex: Knex): Promise<void> {
  const tables = [
    'users',
    'notifications',
    'wallets',
    'transactions',
    'wallet_types',
    'wallet_policies',
    'categories',
    'category_groups',
    'files',
    'transaction_files',
  ];

  for (let index = 0; index < tables.length; index++) {
    const key = tables[index];
    const isExisted = await knex.schema.hasTable(key);
    if (isExisted) {
      await knex(key).del();
    }
  }

  const insertUsersStartTime = performance.now();
  await knex<User>('users').insert([
    {
      id: 1,
      email: 'admin@gmail.com',
      roles: [Role.Admin, Role.User],
      last_name: '',
      first_name: 'Administrator',
      created_by: 1,
      updated_by: 1,
      password: '',
    },
    {
      id: 2,
      email: 'admin1@gmail.com',
      roles: [Role.Admin, Role.User],
      last_name: '',
      first_name: 'John',
      created_by: 2,
      updated_by: 2,
      password: '',
    },
  ]);

  const insertUsersEndTime = performance.now();
  console.info(
    `Finished inserting users in ${(
      insertUsersEndTime - insertUsersStartTime
    ).toFixed(2)} milliseconds`,
  );

  const insertWalletsStartTime = performance.now();
  // Inserts seed entries
  await knex<WalletPolicy>('wallet_policies').insert([
    {
      id: 1,
      name: 'Default',
      description: 'This is a default wallet policy',
      created_by: 1,
      updated_by: 1,
    },
    {
      id: 2,
      name: 'Plaid policy',
      description: 'This is a Plaid wallet policy',
      created_by: 1,
      updated_by: 1,
    },
  ]);

  await knex<WalletType>('wallet_types').insert([
    {
      id: 1,
      name: 'Default',
      policy_id: 1,
      description: 'This is a default wallet type',
      created_by: 1,
      updated_by: 1,
    },
    {
      id: 2,
      name: 'Plaid',
      policy_id: 2,
      description: 'This is a Plaid wallet type',
      created_by: 1,
      updated_by: 1,
    },
  ]);

  await knex<Wallet>('wallets').insert([
    {
      name: 'Default wallet',
      amount_in_usd: 0.0,
      belongs_to: 1,
      wallet_type_id: 1,
      created_by: 1,
      updated_by: 1,
    },
    {
      name: 'Default wallet',
      amount_in_usd: 0.0,
      belongs_to: 2,
      wallet_type_id: 1,
      created_by: 2,
      updated_by: 2,
    },
  ]);

  const insertWalletsEndTime = performance.now();
  console.info(
    `Finished inserting wallets in ${(
      insertWalletsEndTime - insertWalletsStartTime
    ).toFixed(2)} milliseconds`,
  );

  const insertCategoriesStartTime = performance.now();

  const categoryGroups = [
    {
      id: 1,
      name: 'Monthly spending',
    },
    {
      id: 2,
      name: 'Necessary spending',
    },
    {
      id: 3,
      name: 'Entertainment',
    },
    {
      id: 4,
      name: 'Revenue',
    },
    {
      id: 5,
      name: 'Other',
    },
  ].map((origin) => ({ ...origin, created_by: 1, updated_by: 1 }));
  await knex<CategoryGroup>('category_groups').insert(categoryGroups);

  const categories: CreateCategoryDto[] = [
    {
      name: 'Food and Drink',
      group_id: 1,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Transportation',
      group_id: 1,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Rentals',
      group_id: 1,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Water Bill',
      group_id: 1,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Phone Bill',
      group_id: 1,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Electricity Bill',
      group_id: 1,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Gas Bill',
      group_id: 1,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'TV Bill',
      group_id: 1,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Internet Bill',
      group_id: 1,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Other Utility Bills',
      group_id: 1,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Home Maintenance',
      group_id: 2,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Vehicle Maintenance',
      group_id: 2,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Medical Checkup',
      group_id: 2,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Insurance',
      group_id: 2,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Education',
      group_id: 2,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Household Items',
      group_id: 2,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Personal Items',
      group_id: 2,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Pets',
      group_id: 2,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Home Services',
      group_id: 2,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Other Expenses',
      group_id: 2,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Fitness',
      group_id: 3,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Beauty',
      group_id: 3,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Gifts and Donations',
      group_id: 3,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Online Services',
      group_id: 3,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Entertainment',
      group_id: 3,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Salary',
      group_id: 4,
      transaction_type: TransactionType.Income,
    },
    {
      name: 'Other Income',
      group_id: 4,
      transaction_type: TransactionType.Income,
    },
    {
      name: 'Outgoing Transfer',
      group_id: 5,
      transaction_type: TransactionType.Expense,
    },
    {
      name: 'Incoming Transfer',
      group_id: 5,
      transaction_type: TransactionType.Income,
    },
  ].map((origin) => ({ ...origin, created_by: 1, updated_by: 1 }));

  await knex<Category>('categories').insert(categories);

  const insertCategoriesEndTime = performance.now();
  console.info(
    `Finished inserting categories in ${(
      insertCategoriesEndTime - insertCategoriesStartTime
    ).toFixed(2)} milliseconds`,
  );

  const transactions = [];

  const insertTransactionsStartTime = performance.now();
  for (let index = 0; index < 4000; index++) {
    const created_and_wallet_id = faker.datatype.number({ min: 1, max: 2 });
    const transaction = {
      created_by: created_and_wallet_id,
      updated_by: created_and_wallet_id,
      wallet_id: created_and_wallet_id,
      category_id: faker.datatype.number({ min: 1, max: 29 }),
      amount_in_usd: faker.finance.amount(),
    };
    transactions.push(transaction);
  }
  const insertTransactionsEndTime = performance.now();

  await knex('transactions').insert(transactions);

  console.info(
    `Finished inserting transactions in ${(
      insertTransactionsEndTime - insertTransactionsStartTime
    ).toFixed(2)} milliseconds`,
  );
}
