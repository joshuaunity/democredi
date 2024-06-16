import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('kycs', (table) => {
        table.uuid('id').primary();
        table.uuid('userId').notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.string('phone').notNullable();
        table.string('nubanNumber').defaultTo('');
        table.string('nubanCode').defaultTo('');
        table.string('bvn').defaultTo('');
        table.boolean('approved').defaultTo(false);
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('kycs');
}

