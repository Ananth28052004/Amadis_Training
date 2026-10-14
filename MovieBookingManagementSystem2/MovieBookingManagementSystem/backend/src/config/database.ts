import { Sequelize } from "sequelize";

const databaseUrl = process.env.DATABASE_URL;

let sequelize: Sequelize;

if (databaseUrl) {
  const isPostgres =
    databaseUrl.startsWith("postgres://") ||
    databaseUrl.startsWith("postgresql://");

  sequelize = new Sequelize(databaseUrl, {
    dialect: isPostgres ? "postgres" : "mysql",
    logging: process.env.NODE_ENV === "production" ? false : console.log,
    dialectOptions:
      process.env.DB_SSL === "false"
        ? {}
        : {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          },
  });
} else {
  const dialect = (process.env.DB_DIALECT as "mysql" | "postgres") || "mysql";
  sequelize = new Sequelize(
    process.env.DB_NAME || "movie_booking",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "Ananth@24",
    {
      host: process.env.DB_HOST || "localhost",
      port:
        Number(process.env.DB_PORT) || (dialect === "postgres" ? 5432 : 3306),
      dialect,
      logging: process.env.NODE_ENV === "production" ? false : console.log,
      dialectOptions:
        process.env.DB_SSL === "true"
          ? {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            }
          : {},
    }
  );
}

export default sequelize;


