import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";

import sequelize from "../config/database.js";

interface ShowAttributes {
  id: number;
  movieId: number;
  theaterId: number;
  showTime: Date;
  price: number;
}

interface ShowCreationAttributes
  extends Optional<ShowAttributes, "id"> {}

class Show
  extends Model<
    ShowAttributes,
    ShowCreationAttributes
  >
  implements ShowAttributes
{
  public id!: number;
  public movieId!: number;
  public theaterId!: number;
  public showTime!: Date;
  public price!: number;
}

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

    theaterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    showTime: {
      type: DataTypes.DATE,
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
