const router = require("express").Router();
const upload = require("../../helpers/upload");
const fileController = require("../controllers/file");
const fileBodyValidator = require("../middlewares/fileBodyValidator");
const listFilesQueryParamsValidator = require("../middlewares/listFilesQueryParamsValidator");


router.post(
  "/",
  upload.single("file"),
  fileBodyValidator,
  fileController.uploadNewFile
);
router.get("/", listFilesQueryParamsValidator, fileController.listFiles);
router.get("/:id", fileController.getFile);
router.put("/:id", upload.single("file"), fileController.updateFile);
router.delete("/:id", fileController.deleteFile);
router.get("/download/:id", fileController.downloadFile);

module.exports = router;
