import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('wallets', (table) => {
        table.uuid('id').primary();
        table.uuid('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.decimal('balance').defaultTo(0);
        table.string('number').unique().notNullable();;
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('wallets');
}

