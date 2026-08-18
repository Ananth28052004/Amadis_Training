import {
  DataTypes,
  Model,
} from "sequelize";

import sequelize from "../config/database";

class Seat extends Model {}

Seat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    showId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    seatNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "AVAILABLE",
        "LOCKED",
        "BOOKED"
      ),
      defaultValue: "AVAILABLE",
    },

    lockedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Seat",
    tableName: "seats",
    timestamps: true,
  }
);

export default Seat;