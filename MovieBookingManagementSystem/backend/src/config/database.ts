import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "movie_booking",
  "postgres",
  "Ananth@24",
  {
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    logging: console.log,
  }
);

export default sequelize;
