import { Knex } from 'knex';
import { PinoLogger } from 'nestjs-pino';
const makeContentColumns = (table: Knex.CreateTableBuilder) => {
  table.string('name', 255).notNullable();
  table.string('description', 255).nullable();
};

const makeDefaultColumns = (table: Knex.CreateTableBuilder) => {
  table.integer('updated_by', 255).unsigned().nullable();
  table.integer('created_by', 255).unsigned().nullable();
  table.foreign('updated_by').references('users.id');
  table.foreign('created_by').references('users.id');
};

const bootstrapDatabase = async (knex: Knex, logger: PinoLogger) => {
  logger.info('Start bootstrapping database');
  let tablesToCreate = [
    // Users table
    {
      key: 'users',
      make: async () => {
        return await knex.schema.createTable('users', (table) => {
          table.increments('id');
          table.index('email', 'idx_email');
          table.string('first_name', 255).notNullable();
          table.string('last_name', 255).notNullable();
          table.string('email', 255).unique().notNullable().unique();
          table.specificType('roles', 'text[]').notNullable();
          table.string('password', 255).notNullable();
          table.string('avatar', 255).nullable();
          table.timestamps(true, true);
          makeDefaultColumns(table);
        });
      },
    },
    // Notifications table
    {
      key: 'notifications',
      make: async () => {
        return await knex.schema.createTable('notifications', (table) => {
          table.increments('id');
          table.index('user_id', 'idx_user_id');
          table.integer('user_id').unsigned().notNullable();
          table.foreign('user_id').references('users.id');
          table.string('message', 1000).notNullable();
          table.boolean('read').defaultTo(false);
          table.timestamps(true, true);
          makeDefaultColumns(table);
        });
      },
    },
    // Wallets table
    {
      key: 'wallets',
      make: async () => {
        return await knex.schema.createTable('wallets', (table) => {
          makeContentColumns(table);
          table.increments('id');
          table.index('belongs_to', 'idx_belongs_to');
          table.string('custom_image', 255).nullable();
          table
            .string('currency_code', 255)
            .notNullable()
            .defaultTo('USD')
            .comment('Follow ISO 4217 currency code');
          table.boolean('is_active').nullable().defaultTo(true);
          table.timestamps(true, true);
          table
            .double('amount_in_usd')
            .notNullable()
            .comment('Use USD at default');
          table.integer('belongs_to').unsigned().notNullable();
          table.foreign('belongs_to').references('users.id');
          table.integer('wallet_type_id').unsigned().notNullable();
          table.foreign('wallet_type_id').references('wallet_types.id');
          table.jsonb('attrs').nullable();
          makeDefaultColumns(table);
        });
      },
    },
    // Plaid provider table
    {
      key: 'plaid_provider',
      make: async () => {
        return await knex.schema.createTable('plaid_provider', (table) => {
          table.string('item_id', 255).notNullable().primary();
          table.string('access_token', 255).notNullable();
          table.integer('user_id', 255).notNullable();
          table.timestamps(true, true);
        });
      },
    },
    // Files table, using cloudinary
    {
      key: 'files',
      make: async () => {
        return await knex.schema.createTable('files', (table) => {
          table.increments('id');
          table.timestamps(true, true);
          table.string('url', 255).notNullable();
          table.string('format', 255).notNullable();
          table.string('resource_type', 255).notNullable();
          table.jsonb('provider_metadata').nullable();
          makeContentColumns(table);
          makeDefaultColumns(table);
        });
      },
    },
    // Transactions table
    {
      key: 'transactions',
      make: async () => {
        return await knex.schema.createTable('transactions', (table) => {
          table.increments('id');
          table.index('created_by', 'idx_created_by');
          table.index('wallet_id', 'idx_wallet_id');
          table.timestamps(true, true);
          table.string('description', 255).nullable();
          table.integer('wallet_id').unsigned().notNullable();
          table.foreign('wallet_id').references('wallets.id');
          table.integer('category_id').unsigned().notNullable();
          table.foreign('category_id').references('categories.id');
          table.boolean('reportable').nullable().defaultTo(true);
          table
            .double('amount_in_usd')
            .notNullable()
            .comment('Use USD at default');
          table.timestamp('transacted_at').defaultTo(knex.fn.now());
          makeDefaultColumns(table);
        });
      },
    },
    // Transaction and files pivot table
    {
      key: 'transaction_files',
      make: async () => {
        return await knex.schema.createTable('transaction_files', (table) => {
          table.increments('id');
          table.index('transaction_id', 'idx_transaction_id');
          table.timestamps(true, true);
          table.integer('transaction_id').unsigned().notNullable();
          table
            .foreign('transaction_id')
            .references('transactions.id')
            .onDelete('CASCADE');
          table.integer('file_id').unsigned().notNullable();
          table.foreign('file_id').references('files.id');
        });
      },
    },
    // Category groups table
    {
      key: 'category_groups',
      make: async () => {
        return await knex.schema.createTable('category_groups', (table) => {
          table.increments('id');
          makeContentColumns(table);
          makeDefaultColumns(table);
          table.timestamps(true, true);
        });
      },
    },
    // Categories table
    {
      key: 'categories',
      make: async () => {
        return await knex.schema.createTable('categories', (table) => {
          table.increments('id');
          table.index('group_id', 'idx_group_id');
          makeContentColumns(table);
          makeDefaultColumns(table);
          table.integer('group_id').unsigned().notNullable();
          table.foreign('group_id').references('category_groups.id');
          table.enu('transaction_type', ['income', 'expense']);
          table.timestamps(true, true);
        });
      },
    },
    // Wallet policies table
    {
      key: 'wallet_policies',
      make: async () => {
        return await knex.schema.createTable('wallet_policies', (table) => {
          table.increments('id');
          makeContentColumns(table);
          table.timestamps(true, true);
          makeDefaultColumns(table);

          //TO DO: implement policy flow
        });
      },
    },
    // Wallet types table
    {
      key: 'wallet_types',
      make: async () => {
        return await knex.schema.createTable('wallet_types', (table) => {
          table.increments('id');
          makeContentColumns(table);
          table.integer('policy_id').unsigned().notNullable();
          table.foreign('policy_id').references('wallet_policies.id');
          table.timestamps(true, true);
          makeDefaultColumns(table);
        });
      },
    },
  ];

  const checkExists = async (key: string) => {
    const isExisted = await knex.schema.hasTable(key);
    if (isExisted) {
      tablesToCreate = tablesToCreate.filter((table) => table.key !== key);
    }
  };

  await Promise.all(tablesToCreate.map((table) => checkExists(table.key)));
  return Promise.all(
    tablesToCreate.map((table) =>
      table
        .make()
        .then(() => {
          logger.info(`Created table ${table.key}`);
        })
        .catch((err) => {
          logger.error(
            `Something occured when creating table ${
              table.key
            }: ${JSON.stringify(err)}`,
          );
        }),
    ),
  );
};

export default bootstrapDatabase;
