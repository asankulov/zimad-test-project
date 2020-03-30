"use strict";

module.exports = {
  up: (queryInterface, _) => {
    return queryInterface.renameColumn("Files", "name", "originalName");
  },
  down: (queryInterface, _) => {
    return queryInterface.renameColumn("Files", "originalName", "name");
  },
};
