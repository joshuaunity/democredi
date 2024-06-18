import knex, { Knex } from 'knex';
import config from './config';

const dbProd: Knex = knex({
    client: config.db.client,
    connection: config.db.connection,
});

const dbTest: Knex = knex({
    client: config.dbTest.client,
    connection: config.dbTest.connection,
});


let db: Knex = dbProd;

if (config.testMode === 'true') {
    db = dbTest;
} else {
    db = dbProd;
}

// Test the database connection
db.raw('SELECT 1')
    .then(() => {
        console.log('Database connection successful');
    })
    .catch((error: any) => {
        console.error('Error connecting to database:', error.message);
    });

export default db;