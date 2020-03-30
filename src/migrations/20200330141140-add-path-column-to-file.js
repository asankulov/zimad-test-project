"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Files", "path", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
  down: async (queryInterface, _) => {
    return queryInterface.removeColumn("Files", "path");
  },
};
