const path = require('path');
const multer = require("multer");
const mime = require("mime-types");
const config = require('../config');

module.exports = multer({
  storage: multer.diskStorage({
    destination: path.join(config.baseDir, "uploads"),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        `${file.fieldname}-${uniqueSuffix}.${mime.extension(file.mimetype)}`
      );
    },
  }),
});
