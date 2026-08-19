import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";

import sequelize from "../config/database.js";

// =====================================
// SEAT ATTRIBUTES
// =====================================

interface SeatAttributes {
  id: number;
  showId: number;
  seatNumber: string;
  status: "available" | "booked";
}

// =====================================
// CREATION ATTRIBUTES
// =====================================

interface SeatCreationAttributes
  extends Optional<
    SeatAttributes,
    "id" | "status"
  > {}

// =====================================
// SEAT MODEL
// =====================================

class Seat extends Model<
  SeatAttributes,
  SeatCreationAttributes
> implements SeatAttributes {

  declare id: number;

  declare showId: number;

  declare seatNumber: string;

  declare status:
    | "available"
    | "booked";
}

// =====================================
// MODEL CONFIGURATION
// =====================================

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
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "available",
        "booked"
      ),

      allowNull: false,

      defaultValue: "available",
    },
  },

  {
    sequelize,

    tableName: "seats",

    timestamps: true,

    indexes: [
      {
        unique: true,

        fields: [
          "showId",
          "seatNumber",
        ],
      },
    ],
  }
);

export default Seat;
