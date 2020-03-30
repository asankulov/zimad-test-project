const faker = require("faker");
const models = require("../../src/models");
const authService = require("../../src/services/auth");
const jwtHelper = require("../../src/helpers/jwt");

jest.mock("../../src/models");
jest.mock("../../src/helpers/jwt");

describe("Auth Service", () => {
  const testUserId = faker.random.number({
    min: 1,
  });
  const testId = faker.internet.email();
  const testNewUserBody = {
    id: testId,
    password: faker.internet.password(),
  };
  const testUser = {
    userId: testUserId,
    id: testId,
  };
  const testRefreshToken = faker.random.uuid();
  const testAccessToken = faker.random.uuid();
  const testTokenPair = {
    accessToken: testAccessToken,
    refreshToken: testRefreshToken,
  };
  const testNewTokenPair = {
    accessToken: faker.random.uuid(),
    refreshToken: testRefreshToken,
  };

  describe("create new user", () => {
    beforeAll(() => {
      Object.assign(models.User, {
        findOne: jest
          .fn()
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(testUser),
        create: jest.fn().mockResolvedValueOnce({
          get: (key) => testUser[key],
        }),
      });
      Object.assign(models.Session, {
        create: jest.fn().mockResolvedValueOnce({
          get: (key) => testTokenPair[key],
        }),
      });
      jwtHelper.generateNewToken = jest
        .fn()
        .mockResolvedValueOnce(testAccessToken);
      Object.assign(models.sequelize, {
        transaction: () => ({
          commit: jest.fn(),
          rollback: jest.fn(),
        }),
      });
    });
    it("should create new user", () => {
      return expect(
        authService.createNewUser(testNewUserBody)
      ).resolves.toEqual(testTokenPair);
    });

    it("should raise error", () => {
      return expect(authService.createNewUser(testNewUserBody)).rejects.toEqual(
        "ID has already taken."
      );
    });

    afterAll(() => {
      models.User.findOne.mockRestore();
      models.User.create.mockRestore();
      models.Session.create.mockRestore();
      jwtHelper.generateNewToken.mockRestore();
      models.sequelize.transaction.mockRestore();
    });
  });

  describe("process login", () => {
    beforeAll(() => {
      Object.assign(models.User, {
        findOne: jest
          .fn()
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce({
            comparePassword: (attempt) => Promise.resolve(false),
          })
          .mockResolvedValueOnce({
            comparePassword: (attempt) => Promise.resolve(true),
            get: (key) => testUser[key],
          }),
      });
      Object.assign(models.Session, {
        create: jest.fn().mockResolvedValueOnce({
          get: (key) => testTokenPair[key],
        }),
      });
      jwtHelper.generateNewToken = jest
        .fn()
        .mockResolvedValueOnce(testAccessToken);
    });
    it("should raise error because of invalid username", () => {
      return expect(authService.processLogin(testNewUserBody)).rejects.toEqual(
        "Invalid id/password."
      );
    });

    it("should raise error because of invalid password", () => {
      return expect(authService.processLogin(testNewUserBody)).rejects.toEqual(
        "Invalid id/password."
      );
    });

    it("should return new token pair", () => {
      return expect(authService.processLogin(testNewUserBody)).resolves.toEqual(
        testTokenPair
      );
    });

    afterAll(() => {
      models.User.findOne.mockRestore();
      models.Session.create.mockRestore();
      jwtHelper.generateNewToken.mockRestore();
    });
  });

  describe("generate new token pair", () => {
    beforeAll(() => {
      Object.assign(models.Session, {
        findOne: jest
          .fn()
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce({
            isRefreshTokenExpired: () => true,
          })
          .mockResolvedValueOnce({
            isRefreshTokenExpired: () => false,
            get: (key) => testNewTokenPair[key],
            set: (key) => jest.fn(),
            save: () => jest.fn(),
          }),
      });
      jwtHelper.generateNewToken = jest
        .fn()
        .mockResolvedValueOnce(testNewTokenPair.accessToken);
    });
    it("should rejects because of not found refreshToken", () => {
      return expect(
        authService.generateNewTokenPair(testTokenPair.refreshToken)
      ).rejects.toEqual("Invalid refreshToken.");
    });

    it("should rejects because of expired refreshToken", () => {
      return expect(
        authService.generateNewTokenPair(testTokenPair.refreshToken)
      ).rejects.toEqual("Invalid refreshToken.");
    });

    it("should generate new token pair", () => {
      return expect(
        authService.generateNewTokenPair(testTokenPair.refreshToken)
      ).resolves.toEqual(testNewTokenPair);
    });
    afterAll(() => {
      models.Session.create.mockRestore();
      jwtHelper.generateNewToken.mockRestore();
    });
  });

  describe("fetch user info by id", () => {
    beforeAll(() => {
      Object.assign(models.User, {
        findByPk: jest
          .fn()
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce({
            get: (key) => testUser[key],
          }),
      });
    });
    it("should rejects because of user not found", () => {
      return expect(
        authService.fetchUserInfoByUserId(testUserId)
      ).rejects.toEqual("User info not found.");
    });

    it("should fetch user info by id", () => {
      return expect(
        authService.fetchUserInfoByUserId(testUserId)
      ).resolves.toEqual({
        id: testId,
      });
    });

    afterAll(() => {
      models.User.findByPk.mockRestore();
    });
  });

  describe("process logout by userId", () => {
    beforeAll(() => {
      Object.assign(models.Session, {
        destroy: jest.fn().mockResolvedValueOnce(1).mockResolvedValueOnce(0),
      });
    });
    it("should revoke token pair", () => {
      return expect(
        authService.revokeTokenPairByUserId(testUserId)
      ).resolves.toBeTruthy();
    });

    it("should rejects because of already revoked token", () => {
      return expect(
        authService.revokeTokenPairByUserId(testUserId)
      ).resolves.toBeFalsy();
    });

    afterAll(() => {
      models.Session.destroy.mockRestore();
    });
  });
});
