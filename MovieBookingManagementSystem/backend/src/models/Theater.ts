import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";

import sequelize from "../config/database.js";

interface TheaterAttributes {
  id: number;
  name: string;
  location: string;
  totalSeats: number;
}

interface TheaterCreationAttributes
  extends Optional<TheaterAttributes, "id"> {}

class Theater
  extends Model<
    TheaterAttributes,
    TheaterCreationAttributes
  >
  implements TheaterAttributes
{
  declare id: number;
  declare name: string;
  declare location: string;
  declare totalSeats: number;
}

Theater.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    totalSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      validate: {
        min: 1,
      },
    },
  },

  {
    sequelize,
    tableName: "theaters",
    timestamps: true,
  }
);

export default Theater;
