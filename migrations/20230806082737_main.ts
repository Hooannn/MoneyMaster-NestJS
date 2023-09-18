import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', function (table) {
    table.increments('id');
    table.string('first_name', 255).notNullable();
    table.string('last_name', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.specificType('roles', 'text[]').notNullable();
    table.string('password', 255).notNullable();
    table.string('avatar', 255).nullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('notifications', function (table) {
    table.increments('id');
    table.integer('user_id').unsigned().notNullable();
    table.foreign('user_id').references('users.id');
    table.string('message', 1000).notNullable();
    table.boolean('read').defaultTo(false);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('wallets', function (table) {
    table.increments('id');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('transactions', function (table) {
    table.increments('id');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('categories', function (table) {
    table.increments('id');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists('notifications')
    .dropTableIfExists('users')
    .dropTableIfExists('wallets')
    .dropTableIfExists('transactions')
    .dropTableIfExists('categories')
    .dropTableIfExists('wallet_types')
    .dropTableIfExists('wallet_policies')
    .dropTableIfExists('category_groups');
}

export const config = { transaction: false };
