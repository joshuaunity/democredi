import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
    port: process.env.PORT || 5000,
    db: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306, 
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '1234',
            database: process.env.DB_NAME || 'democredi',
        },
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'samplesecret',
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
    karma: {
        secret: process.env.KARMA_SECRET || 'samplesecret',
        api: process.env.KARMA_API || 'https://karma.com/api',
    }
    // Other configurations can go here
};

export default config;
