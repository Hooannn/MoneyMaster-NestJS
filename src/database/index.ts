import { KnexModule, KnexModuleOptions } from 'nestjs-knex';
import * as knexConfig from '../../knexfile';
import bootstrapDatabase from './bootstrap';
import dropDatabase from './drop';
const knexModuleOptions: KnexModuleOptions = {
  config: knexConfig['production'],
};

const Knex = KnexModule.forRoot(knexModuleOptions);

export { Knex, bootstrapDatabase, dropDatabase };
