"use strict";
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
    },
    {}
  );
  User.associate = (models) => {
    User.hasMany(models.File);
    User.hasMany(models.Session);
  };
  User.beforeCreate((user, _) => {
    user.password = bcrypt.hashSync(user.password, 10);
  });
  User.prototype.comparePassword = function (attempt) {
    return bcrypt.compareSync(attempt, this.get("password"));
  };
  return User;
};
