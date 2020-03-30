const fileService = require("../../services/file");
const mime = require("mime-types");

module.exports = {
  async uploadNewFile(req, res) {
    const uploadedFile = req.file;
    try {
      const newFile = await fileService.upsertFile(req.user.userId, {
        originalName: uploadedFile.originalname,
        extension: mime.extension(uploadedFile.mimetype),
        mimeType: uploadedFile.mimetype,
        size: uploadedFile.size,
        path: uploadedFile.path,
      });
      return res.status(201).json(newFile);
    } catch (error) {
      throw error;
    }
  },
  async listFiles(req, res) {
    try {
      const files = await fileService.fetchMultipleFiles(
        req.user.userId,
        req.query.listSize || 10,
        req.query.page || 1
      );
      return res.status(200).json(files);
    } catch (error) {
      throw error;
    }
  },
  async getFile(req, res) {
    try {
      const file = await fileService.fetchSingleFileById(
        req.user.userId,
        req.params.id
      );
      return res.status(200).json(file);
    } catch (error) {
      if (error === "File not found.") {
        return res.status(404).json({
          message: "File not found.",
        });
      }
      throw error;
    }
  },
  async updateFile(req, res) {
    const uploadedFile = req.file;
    try {
      const updatedFile = await fileService.upsertFile(
        req.user.userId,
        {
          originalName: uploadedFile.originalname,
          extension: mime.extension(uploadedFile.mimetype),
          mimeType: uploadedFile.mimetype,
          size: uploadedFile.size,
          path: uploadedFile.path,
        },
        req.params.id
      );
      return res.status(200).json(updatedFile);
    } catch (error) {
      if (error === "File not found.") {
        return res.status(404).json({
          message: "File not found.",
        });
      }
      throw error;
    }
  },
  async deleteFile(req, res) {
    try {
      await fileService.deleteFileById(req.user.userId, req.params.id);
      return res.sendStatus(204);
    } catch (error) {
      if (error === "File not found.") {
        return res.status(404).json({
          message: "File not found.",
        });
      }
      throw error;
    }
  },
  async downloadFile(req, res) {
    try {
      const filePath = await fileService.getFilePath(
        req.user.userId,
        req.params.id
      );
      return res.status(200).download(filePath);
    } catch (error) {
      if (error === "File not found.") {
        return res.status(404).json({
          message: "File not found.",
        });
      }
      throw error;
    }
  },
};
