"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface
        .addColumn(
          "Users",
          "createdAt",
          {
            type: Sequelize.DATE,
            allowNull: false,
          },
          { transaction: t }
        )
        .then(() => {
          return queryInterface.addColumn(
            "Users",
            "updatedAt",
            {
              type: Sequelize.DATE,
              allowNull: false,
            },
            { transaction: t }
          );
        })
        .then(() => {
          return queryInterface.addColumn(
            "Files",
            "createdAt",
            {
              type: Sequelize.DATE,
              allowNull: false,
            },
            { transaction: t }
          );
        })
        .then(() => {
          return queryInterface.addColumn(
            "Files",
            "updatedAt",
            {
              type: Sequelize.DATE,
              allowNull: false,
            },
            { transaction: t }
          );
        });
    });
  },
  down: async (queryInterface, _) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface
        .removeColumn("Users", "createdAt", { transaction: t })
        .then(() => {
          return queryInterface.removeColumn("Users", "updatedAt", {
            transaction: t,
          });
        })
        .then(() => {
          return queryInterface.removeColumn("Files", "createdAt", {
            transaction: t,
          });
        })
        .then(() => {
          return queryInterface.removeColumn("Files", "updatedAt", {
            transaction: t,
          });
        });
    });
  },
};
