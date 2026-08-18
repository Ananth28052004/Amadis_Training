import {
  DataTypes,
  Model,
} from "sequelize";

import sequelize from "../config/database";

class Movie extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public duration!: number;
  public language!: string;
  public posterUrl!: string | null;
}

Movie.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    posterUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Movie",
    tableName: "movies",
    timestamps: true,
  }
);

export default Movie;
