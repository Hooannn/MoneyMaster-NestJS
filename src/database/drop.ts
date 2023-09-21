import { Knex } from 'knex';
import { PinoLogger } from 'nestjs-pino';

const dropDatabase = async (knex: Knex, logger: PinoLogger) => {
  const traceSuccess = (key: string) => logger.trace(`Droped table ${key}`);
  const traceError = (key: string, error: any) =>
    logger.error(`Droped table ${key} error: ${JSON.stringify(error)}`);

  const tablesToDrop = [
    'transactions',
    'wallet_types',
    'wallet_policies',
    'users',
    'wallets',
    'notifications',
    'category_groups',
    'categories',
    'files',
    'transaction_files',
  ];

  return await Promise.all(
    tablesToDrop.map((key) =>
      knex.schema
        .dropTableIfExists(key)
        .then(() => traceSuccess(key))
        .catch((err) => traceError(key, err)),
    ),
  );
};

export default dropDatabase;
