"use strict";
const ms = require("ms");
const config = require("../config");

module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define(
    "Session",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
      },
      accessToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {}
  );
  Session.associate = function (models) {
    Session.belongsTo(models.User);
  };
  Session.beforeSave((session, _) => {
    session.expiresAt =
      new Date().getTime() + ms(config.jwt.refreshTokenLifeTime);
  });
  Session.prototype.isRefreshTokenExpired = function () {
    return this.expiresAt.getTime() <= new Date().getTime();
  };
  return Session;
};
