"use strict";

module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define(
    "File",
    {
      originalName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      extension: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mimeType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uploadedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );
  File.associate = (models) => {
    File.belongsTo(models.User);
  };
  // File.beforeSave((file, options) => {
  //   file.uploadedAt = new Date().getTime();
  // });
  return File;
};
