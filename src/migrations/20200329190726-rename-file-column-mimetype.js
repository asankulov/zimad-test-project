"use strict";

module.exports = {
  up: (queryInterface, _) => {
    return queryInterface.renameColumn("Files", "mimetype", "mimeType");
  },
  down: (queryInterface, _) => {
    return queryInterface.renameColumn("Files", "mimeType", "mimetype");
  },
};
