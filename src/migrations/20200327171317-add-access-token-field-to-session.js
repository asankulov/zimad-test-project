"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("sessions", "accessToken", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
  down: async (queryInterface, _) => {
    return queryInterface.removeColumn("sessions", "accessToken");
  },
};
