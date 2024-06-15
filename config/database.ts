import knex, { Knex } from 'knex';
import config from './config';

const db: Knex = knex({
    client: config.db.client,
    connection: config.db.connection,
});

// Test the database connection
db.raw('SELECT 1')
    .then(() => {
        console.log('Database connection successful');
    })
    .catch((error: any) => {
        console.error('Error connecting to database:', error.message);
    });

export default db;
