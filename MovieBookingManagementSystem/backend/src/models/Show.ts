import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Show extends Model {}

Show.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    showDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    showTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "shows",
    timestamps: true,
  }
);

export default Show;