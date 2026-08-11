const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * User Model
 *
 * ORM maps this JavaScript class to a "users" table in the database.
 * Instead of writing: INSERT INTO users (name, email) VALUES (...)
 * We write: User.create({ name, email })
 */
const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

module.exports = User;
