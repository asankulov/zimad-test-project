const fileController = require("../../src/api/controllers/file");
const faker = require("faker");
const httpMocks = require("node-mocks-http");
const fileService = require("../../src/services/file");
const mime = require("mime-types");

jest.mock("../../src/services/file");
jest.mock("mime-types");

describe("File Controller", () => {
  const testMulterFile = {
    fieldname: faker.random.word(),
    originalname: faker.system.fileName(),
    encoding: faker.database.collation(),
    mimetype: faker.system.mimeType(),
    size: faker.random.number(),
    path: faker.internet.url(),
    destination: faker.random.word(),
    filename: faker.system.fileName(),
  };
  const testFileData = {
    id: faker.random.number(),
    originalName: faker.system.fileName(),
    extension: faker.system.commonFileExt(),
    mimeType: faker.system.mimeType(),
    size: faker.random.number(),
  };
  const testUserId = faker.random.number();
  const getResMock = jest.fn(() => httpMocks.createResponse());
  describe("upload new file", () => {
    const getReqMock = jest.fn(() => {
      return httpMocks.createRequest({
        file: testMulterFile,
        user: {
          userId: testUserId,
        },
      });
    });
    beforeAll(() => {
      fileService.upsertFile = jest.fn().mockResolvedValueOnce(testFileData);
      mime.extension = jest
        .fn()
        .mockResolvedValueOnce(faker.system.commonFileExt());
    });
    it("should return uploaded file data", async () => {
      const response = await fileController.uploadNewFile(
        getReqMock(),
        getResMock()
      );
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toEqual(testFileData);
      expect(fileService.upsertFile).toBeCalledTimes(1);
      expect(mime.extension).toBeCalledTimes(1);
    });
    afterAll(() => {
      fileService.upsertFile.mockRestore();
      mime.extension.mockRestore();
    });
  });

  describe("list files", () => {
    const getReqMock = jest.fn(() => {
      return httpMocks.createRequest({
        user: {
          userId: testUserId,
        },
        query: {
          listSize: faker.random.number(),
          page: faker.random.number(),
        },
      });
    });
    beforeAll(() => {
      fileService.fetchMultipleFiles = jest
        .fn()
        .mockResolvedValueOnce([testFileData]);
    });
    it("should return list of file data", async () => {
      const response = await fileController.listFiles(
        getReqMock(),
        getResMock()
      );
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual([testFileData]);
      expect(fileService.fetchMultipleFiles).toBeCalledTimes(1);
    });
    afterAll(() => {
      fileService.fetchMultipleFiles.mockRestore();
    });
  });

  describe("get file", () => {
    const getReqMock = jest.fn(() => {
      return httpMocks.createRequest({
        user: {
          userId: testUserId,
        },
        params: {
          id: testFileData.id,
        },
      });
    });
    beforeAll(() => {
      fileService.fetchSingleFileById = jest
        .fn()
        .mockResolvedValueOnce(testFileData)
        .mockRejectedValueOnce("File not found.");
    });
    it("should return single file data", async () => {
      const response = await fileController.getFile(getReqMock(), getResMock());
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(testFileData);
      expect(fileService.fetchSingleFileById).toBeCalled();
    });
    it("should return 404", async () => {
      const response = await fileController.getFile(getReqMock(), getResMock());
      expect(response.statusCode).toBe(404);
      expect(response._getJSONData()).toHaveProperty("message");
      expect(fileService.fetchSingleFileById).toBeCalled();
    });
    afterAll(() => {
      fileService.fetchSingleFileById.mockRestore();
    });
  });

  describe("update file", () => {
    const getReqMock = jest.fn(() => {
      return httpMocks.createRequest({
        file: testMulterFile,
        user: {
          userId: testUserId,
        },
        params: {
          id: testUserId,
        },
      });
    });
    beforeAll(() => {
      fileService.upsertFile = jest
        .fn()
        .mockResolvedValueOnce(testFileData)
        .mockRejectedValueOnce("File not found.");
      mime.extension = jest
        .fn()
        .mockResolvedValueOnce(faker.system.commonFileExt());
    });
    it("should return updated file data", async () => {
      const response = await fileController.updateFile(
        getReqMock(),
        getResMock()
      );
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(testFileData);
      expect(fileService.upsertFile).toBeCalled();
      expect(mime.extension).toBeCalled();
    });

    it("should return 404", async () => {
      const response = await fileController.updateFile(
        getReqMock(),
        getResMock()
      );
      expect(response.statusCode).toBe(404);
      expect(response._getJSONData()).toHaveProperty("message");
      expect(fileService.upsertFile).toBeCalled();
      expect(mime.extension).toBeCalled();
    });
    afterAll(() => {
      fileService.upsertFile.mockRestore();
      mime.extension.mockRestore();
    });
  });

  describe("delete file", () => {
    const getReqMock = jest.fn(() => {
      return httpMocks.createRequest({
        user: {
          userId: testUserId,
        },
        params: {
          id: testFileData.id,
        },
      });
    });
    beforeAll(() => {
      fileService.deleteFileById = jest
        .fn()
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce("File not found.");
    });
    it("should return 204 with no content", async () => {
      const response = await fileController.deleteFile(
        getReqMock(),
        getResMock()
      );
      expect(response.statusCode).toBe(204);
      expect(fileService.deleteFileById).toBeCalled();
    });
    it("should return 404", async () => {
      const response = await fileController.deleteFile(
        getReqMock(),
        getResMock()
      );
      expect(response.statusCode).toBe(404);
      expect(fileService.deleteFileById).toBeCalled();
    });
    afterAll(() => {
      fileService.deleteFileById.mockRestore();
    });
  });

  describe("download file", () => {
    const getReqMock = jest.fn(() => {
      return httpMocks.createRequest({
        user: {
          userId: testUserId,
        },
        params: {
          id: testFileData.id,
        },
      });
    });
    beforeAll(() => {
      fileService.getFilePath = jest
        .fn()
        .mockRejectedValueOnce("File not found.");
    });
    it("should return 404", async () => {
      const response = await fileController.downloadFile(
        getReqMock(),
        getResMock()
      );
      expect(response.statusCode).toBe(404);
      expect(fileService.getFilePath).toBeCalledTimes(1);
    });
    afterAll(() => {
      fileService.getFilePath.mockRestore();
    });
  });
});
