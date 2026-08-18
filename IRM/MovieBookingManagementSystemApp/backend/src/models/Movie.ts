import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";

import sequelize from "../config/database.js";

interface MovieAttributes {
  id: number;
  title: string;
  description: string;
  genre: string;
  duration: number;
  rating: number;
  image: string;
}

interface MovieCreationAttributes
  extends Optional<MovieAttributes, "id"> {}

class Movie
  extends Model<MovieAttributes, MovieCreationAttributes>
  implements MovieAttributes
{
  declare id: number;
  declare title: string;
  declare description: string;
  declare genre: string;
  declare duration: number;
  declare rating: number;
  declare image: string;
}

Movie.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    genre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    rating: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      defaultValue: 0,
    },

    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "movies",
    timestamps: true,
  }
);

export default Movie;
