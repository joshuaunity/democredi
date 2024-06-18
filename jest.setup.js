// jest.setup.js
import db from './config/database'; // Adjust the path as necessary

beforeAll(async () => {
    try {
        await db.raw('SELECT 1');
        console.log('Database connection successful');
    } catch (error) {
        console.error('Error connecting to database:', error.message);
        process.exit(1); // Exit the process if there's an error
    }
});
