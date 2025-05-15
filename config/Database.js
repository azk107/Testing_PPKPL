import { Sequelize } from "sequelize";

const db = new Sequelize('bread_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: {
        charset: 'utf8mb4',
    },
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    },
    logging: false
});

export const closeDatabase = async () => {
    await db.close();
};

export default db;