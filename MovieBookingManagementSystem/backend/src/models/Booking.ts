import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Booking extends Model {}

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

    seatIds: {
      type: DataTypes.JSONB,
      allowNull: false,
    },

    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        "CONFIRMED",
        "CANCELLED"
      ),
      defaultValue: "CONFIRMED",
    },

    bookingReference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "bookings",
    timestamps: true,
  }
);

export default Booking;