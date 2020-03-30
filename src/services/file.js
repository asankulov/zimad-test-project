const models = require("../models/");
const File = models.File;
const fs = require("fs");

module.exports = {
  async upsertFile(userId, fileData, fileId) {
    try {
      if (fileId) {
        const existedFile = await File.findOne({
          where: {
            id: fileId,
            userId,
          },
          attributes: ["id", "originalName", "extension", "mimeType", "size", "path"]
        });
        if (!existedFile) {
          return Promise.reject("File not found.");
        }
        fs.unlinkSync(existedFile.get("path"));
        existedFile.set(fileData);
        existedFile.save();
        return {
          id: existedFile.get('id'),
          originalName: existedFile.get('originalName'),
          extension: existedFile.get('extension'),
          mimeType: existedFile.get('mimeType'),
          size: existedFile.get("size")
        }
      }
      const newFile = await File.create({
        userId,
        ...fileData,
      });
      delete fileData.path;
      return {
        ...fileData,
        id: newFile.get("id"),
      };
    } catch (error) {
      throw error;
    }
  },
  async fetchMultipleFiles(userId, listSize = 10, page = 1) {
    try {
      return await File.findAll({
        where: {
          userId,
        },
        limit: listSize,
        offset: listSize * (page - 1),
        attributes: ["id", "originalName", "extension", "mimeType", "size"],
      });
    } catch (error) {
      throw error;
    }
  },
  async fetchSingleFileById(userId, fileId) {
    try {
      const file = await File.findOne({
        where: {
          id: fileId,
          userId,
        },
        attributes: ["id", "originalName", "extension", "mimeType", "size"],
      });
      if (!file) {
        return Promise.reject("File not found.");
      }
      return file.toJSON();
    } catch (error) {
      throw error;
    }
  },
  async deleteFileById(userId, fileId) {
    try {
      const file = await File.findOne({
        where: {
          userId,
          id: fileId,
        },
        attributes: ["id", "path"],
      });
      if (!file) {
        return Promise.reject("File not found.");
      }
      const path = file.get("path");
      await file.destroy();
      fs.unlinkSync(path);
    } catch (error) {
      throw error;
    }
  },
  async getFilePath(userId, fileId) {
    try {
      const file = await File.findOne({
        where: {
          userId,
          id: fileId,
        },
        attributes: ["path"],
      });
      if (!file) {
        return Promise.reject("File not found.");
      }
      return file.get("path");
    } catch (error) {
      throw error;
    }
  },
};
