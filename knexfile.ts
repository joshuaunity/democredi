import type { Knex } from 'knex';
import config from './config/config';

const knexConfig: { [key: string]: Knex.Config } = {
    development: {
        client: 'mysql2',
        connection: config.db.connection,
        migrations: {
            directory: './src/db/migrations',
        },
        seeds: {
            directory: './src/db/seeds',
        },
    },
    test: {
        client: 'mysql2',
        connection: config.dbTest.connection,
        migrations: {
            directory: './src/db/migrations',
        },
        seeds: {
            directory: './src/db/seeds',
        },
    },
};

export default knexConfig;
