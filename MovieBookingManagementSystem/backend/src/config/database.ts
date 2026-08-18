
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "movie_booking",
  "postgres",
  "YOUR_POSTGRES_PASSWORD",
  {
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    logging: false,
  }
);

export default sequelize;
