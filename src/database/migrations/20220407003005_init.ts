import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('todos', function (table: any ) {
      table.increments('id').primary();
      table.string('title', 255).notNullable();
      table.string('status', 255).notNullable();
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable("todos")
}

