import { KnexModule, KnexModuleOptions } from 'nestjs-knex';
import config from '../configs';
const knexModuleOptions: KnexModuleOptions = {
  config: {
    client: 'pg',
    connection: {
      connectionString: config['DATABASE_URL'],
      host: config['DB_HOST'],
      port: parseInt(config['DB_PORT']),
      user: config['DB_USER'],
      database: config['DB_NAME'],
      password: config['DB_PASSWORD'],
      ssl: config['DB_SSL'] ? { rejectUnauthorized: false } : false,
    },
  },
};

const Knex = KnexModule.forRoot(knexModuleOptions);

export { Knex };
