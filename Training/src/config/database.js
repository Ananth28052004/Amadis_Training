const { Sequelize } = require('sequelize');
/**
 * PostgreSQL connection via Sequelize.
 * Credentials are read from the .env file (see .env.example).
 */
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  String(process.env.DB_PASSWORD),
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: console.log,
  }
);

module.exports = sequelize;
