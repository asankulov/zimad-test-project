const faker = require("faker");
const fileService = require("../../src/services/file");
const models = require("../../src/models");
const fs = require("fs");

jest.mock("../../src/models");

describe("File Service", () => {
  beforeAll(() => {
    fs.unlinkSync = jest.fn();
  });
  const testUserUserId = faker.random.number({
    min: 1,
  });
  const testFileId = faker.random.number({
    min: 1,
  });
  const testFileData = {
    originalName: faker.system.fileName(),
    extension: faker.system.commonFileExt(),
    mimeType: faker.system.mimeType(),
    size: faker.random.number(),
  };
  const testSuccessFileResponse = Object.assign({}, testFileData, {
    id: testFileId,
  });
  const testPath = faker.internet.url();

  describe("upsert file", () => {
    describe("insert new file", () => {
      beforeAll(() => {
        models.File.create = jest.fn().mockResolvedValueOnce({
          get: (key) => testSuccessFileResponse[key],
        });
      });
      it("should insert new file", () => {
        return expect(
          fileService.upsertFile(testUserUserId, testFileData)
        ).resolves.toEqual(testSuccessFileResponse);
      });
      afterAll(() => {
        models.File.create.mockRestore();
      });
    });

    describe("update file", () => {
      beforeAll(() => {
        models.File.findOne = jest
          .fn()
          .mockResolvedValueOnce({
            get: jest.fn().mockImplementation((key) => {
              return testSuccessFileResponse[key];
            }),
            set: jest.fn(),
            save: jest.fn(),
          })
          .mockResolvedValueOnce(null);
      });
      it("should update file by id", () => {
        return expect(
          fileService.upsertFile(testUserUserId, testFileData, testFileId)
        ).resolves.toEqual({
          ...testSuccessFileResponse,
        });
      });
      it("should rejects", () => {
        return expect(
          fileService.upsertFile(testUserUserId, testFileData, testFileId)
        ).rejects.toBe("File not found.");
      });
      afterAll(() => {
        models.File.findOne.mockRestore();
      });
    });
  });

  describe("fetch multiple files", () => {
    beforeAll(() => {
      models.File.findAll = jest
        .fn()
        .mockResolvedValueOnce([testSuccessFileResponse]);
    });
    it("should return multiple files", () => {
      return expect(
        fileService.fetchMultipleFiles(testUserUserId)
      ).resolves.toEqual([testSuccessFileResponse]);
    });
    afterAll(() => {
      models.File.findAll.mockRestore();
    });
  });

  describe("fetch single file by id", () => {
    beforeAll(() => {
      models.File.findOne = jest.fn().mockResolvedValueOnce({
        toJSON: jest.fn().mockReturnValueOnce(testSuccessFileResponse),
      });
    });
    it("should return single file", () => {
      return expect(
        fileService.fetchSingleFileById(testUserUserId, testFileId)
      ).resolves.toEqual(testSuccessFileResponse);
    });
    afterAll(() => {
      models.File.findOne.mockRestore();
    });
  });

  describe("delete file by id", () => {
    beforeAll(() => {
      fs.unlinkSync = jest.fn();
      models.File.findOne = jest
        .fn()
        .mockResolvedValueOnce({
          get: jest.fn().mockReturnValueOnce(testPath),
          destroy: jest.fn(),
        })
        .mockResolvedValueOnce(null);
    });
    it("should delete single file", () => {
      return expect(
        fileService.deleteFileById(testUserUserId, testFileId)
      ).resolves.not.toThrow();
    });
    it("should rejects", () => {
      return expect(
        fileService.deleteFileById(testUserUserId, testFileId)
      ).rejects.toBe("File not found.");
    });

    afterAll(() => {
      models.File.findOne.mockRestore();
    });
  });

  describe("get file path by id", () => {
    beforeAll(() => {
      models.File.findOne = jest.fn().mockResolvedValueOnce({
        get: jest.fn().mockReturnValueOnce(testPath),
      });
    });
    it("should return file path", () => {
      return expect(fileService.getFilePath(testFileId)).resolves.toBe(
        testPath
      );
    });
  });
  afterAll(() => {
    fs.unlinkSync.mockRestore();
  });
});
