import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('users', (table) => {
        table.string('email'); // Adding new email field
        // Other alterations if needed
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.table('users', (table) => {
        table.dropColumn('email'); // Dropping the email field
        // Revert other alterations if needed
    });
}
