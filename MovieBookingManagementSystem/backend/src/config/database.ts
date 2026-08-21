import { Sequelize } from "sequelize";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;

let sequelize: Sequelize;

if (databaseUrl) {
  sequelize = new Sequelize(databaseUrl, {
    dialect: "postgres",
    logging: process.env.NODE_ENV === "production" ? false : console.log,
    dialectOptions: {
      ssl: process.env.DB_SSL === "false" ? false : {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  const dbName = process.env.DB_NAME || "movie_booking";
  const dbUser = process.env.DB_USER || "postgres";
  const dbPass = process.env.DB_PASSWORD || "Ananth@24";
  const dbHost = process.env.DB_HOST || "localhost";
  const dbPort = Number(process.env.DB_PORT) || 5432;
  const isSsl = process.env.DB_SSL === "true";

  sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "production" ? false : console.log,
    dialectOptions: isSsl
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  });
}

export default sequelize;

