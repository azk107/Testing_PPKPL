// jest.teardown.js
import { closeDatabase } from './config/Database.js';

// Tambahkan log untuk debugging
console.log("Teardown: Starting database teardown...");

afterAll(async () => {
    try {
        console.log("Teardown: Closing database connection...");
        await closeDatabase();
        console.log("Teardown: Database connection closed.");
    } catch (error) {
        console.error("Teardown: Failed to close database connection:", error);
    }
});