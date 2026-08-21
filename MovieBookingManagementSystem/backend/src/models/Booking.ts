import {DataTypes,Model,Optional,} from "sequelize";
import sequelize from "../config/database.js";

interface BookingAttributes {
  id: number;
  userId: number;
  showId: number;
  seatId: number;
  status: "confirmed" | "cancelled";
}

interface BookingCreationAttributes extends Optional<BookingAttributes,"id" | "status"> {}
class Booking extends Model<BookingAttributes,BookingCreationAttributes>implements BookingAttributes
{
  declare id: number;
  declare userId: number;
  declare showId: number;
  declare seatId: number;
  declare status:| "confirmed"| "cancelled";
}

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    showId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    seatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "confirmed",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "confirmed",
    },
  },
  {
    sequelize,
    tableName: "bookings",
    timestamps: true,

    indexes: [
      {
        unique: true,
        fields: [
          "showId",
          "seatId",
        ],
        where: {
          status: "confirmed",
        },
      },
    ],
  }
);

export default Booking;
