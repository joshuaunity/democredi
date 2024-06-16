import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('transactions', (table) => { 
        table.uuid('id').primary();
        table.uuid('walletId').notNullable().references('id').inTable('wallets').onDelete('CASCADE');
        table.decimal('amount').notNullable();
        table.enum('type', ['credit', 'debit']).notNullable();
        table.string('narration').defaultTo('');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });

}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('transactions');
}
