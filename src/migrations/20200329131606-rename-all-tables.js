"use strict";

module.exports = {
  up: (queryInterface, _) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface
        .renameTable("users", "Users", { transaction: t })
        .then(() => {
          return queryInterface.renameTable("sessions", "Sessions", {
            transaction: t,
          });
        })
        .then(() => {
          return queryInterface.renameTable("files", "Files", {
            transaction: t,
          });
        });
    });
  },

  down: (queryInterface, _) => {
    return queryInterface.sequelize.transaction((t) => {
      return queryInterface
        .renameTable("Users", "users", { transaction: t })
        .then(() => {
          return queryInterface.renameTable("Sessions", "sessions", {
            transaction: t,
          });
        })
        .then(() => {
          return queryInterface.renameTable("Files", "files", {
            transaction: t,
          });
        });
    });
  },
};
