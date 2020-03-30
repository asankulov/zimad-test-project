const authController = require("../../src/api/controllers/auth");
const authService = require("../../src/services/auth");
const faker = require("faker");
const httpMocks = require("node-mocks-http");

jest.mock("../../src/services/auth");

describe("Auth Controller", () => {
  const testRefreshToken = faker.random.uuid();
  const testAccessToken = faker.random.uuid();
  const testTokenPair = {
    refreshToken: testRefreshToken,
    accessToken: testAccessToken,
  };
  const testUserId = faker.phone.phoneNumber();
  const testUserUserId = faker.random.number({
    min: 1,
  });
  const testRequestUserBody = {
    id: testUserId,
    password: faker.internet.password(),
  };
  const testUserInfo = {
    id: testUserId,
  };

  Object.assign(authService, {
    createNewUser: jest
      .fn()
      .mockRejectedValueOnce("ID has already taken.")
      .mockResolvedValueOnce(testTokenPair),
    processLogin: jest
      .fn()
      .mockRejectedValueOnce("Invalid id/password.")
      .mockResolvedValueOnce(testTokenPair),
    generateNewTokenPair: jest
      .fn()
      .mockRejectedValueOnce("Invalid refreshToken.")
      .mockResolvedValueOnce(testTokenPair),
    fetchUserInfoByUserId: jest
      .fn()
      .mockRejectedValueOnce("User info not found.")
      .mockResolvedValueOnce({
        id: testUserId,
      }),
    revokeTokenPairByUserId: jest
      .fn()
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true),
  });
  const getResMock = jest.fn(() => httpMocks.createResponse());

  describe("sign up user", () => {
    const getReqMock = jest.fn(() => {
      return httpMocks.createRequest({
        body: testRequestUserBody,
      });
    });

    it("should return 400", async () => {
      const response = await authController.signUp(getReqMock(), getResMock());
      expect(response.statusCode).toBe(400);
      expect(response._getJSONData()).toHaveProperty("message");
      expect(authService.createNewUser).toBeCalled();
      expect(authService.createNewUser).toBeCalledWith(testRequestUserBody);
    });

    it("should return 201 with token pair", async () => {
      const response = await authController.signUp(getReqMock(), getResMock());
      expect(response.statusCode).toBe(201);
      expect(response._getJSONData()).toEqual(testTokenPair);
      expect(authService.createNewUser).toBeCalled();
      expect(authService.createNewUser).toBeCalledWith(testRequestUserBody);
    });
  });

  describe("sign in user", () => {
    const getReqMock = jest.fn(() => {
      return httpMocks.createRequest({
        body: testRequestUserBody,
      });
    });

    it("should return 400", async () => {
      const response = await authController.signIn(getReqMock(), getResMock());
      expect(response.statusCode).toBe(400);
      expect(response._getJSONData()).toHaveProperty("message");
      expect(authService.processLogin).toBeCalled();
      expect(authService.processLogin).toBeCalledWith(testRequestUserBody);
    });

    it("should return 200 with token pair", async () => {
      const response = await authController.signIn(getReqMock(), getResMock());
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(testTokenPair);
      expect(authService.processLogin).toBeCalled();
      expect(authService.processLogin).toBeCalledWith(testRequestUserBody);
    });
  });

  describe("get new token pair", () => {
    const getReqMock = jest.fn(() => {
      return httpMocks.createRequest({
        body: {
          refreshToken: testRefreshToken,
        },
      });
    });

    it("should return 400", async () => {
      const response = await authController.getNewTokenPair(
        getReqMock(),
        getResMock()
      );
      expect(response.statusCode).toBe(400);
      expect(response._getJSONData()).toHaveProperty("message");
      expect(authService.generateNewTokenPair).toBeCalled();
      expect(authService.generateNewTokenPair).toBeCalledWith(testRefreshToken);
    });

    it("should return 200 with token pair", async () => {
      const response = await authController.getNewTokenPair(
        getReqMock(),
        getResMock()
      );
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(testTokenPair);
      expect(authService.generateNewTokenPair).toBeCalled();
      expect(authService.generateNewTokenPair).toBeCalledWith(testRefreshToken);
    });
  });

  describe("get user info", () => {
    const getReqMock = jest.fn(() => {
      return httpMocks.createRequest({
        user: {
          userId: testUserUserId,
        },
      });
    });

    it("should return 404", async () => {
      const response = await authController.getUserInfo(
        getReqMock(),
        getResMock()
      );
      expect(response.statusCode).toBe(400);
      expect(response._getJSONData()).toHaveProperty("message");
      expect(authService.fetchUserInfoByUserId).toBeCalled();
      expect(authService.fetchUserInfoByUserId).toBeCalledWith(testUserUserId);
    });

    it("should return 200 user info", async () => {
      const response = await authController.getUserInfo(
        getReqMock(),
        getResMock()
      );
      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual(testUserInfo);
      expect(authService.fetchUserInfoByUserId).toBeCalled();
      expect(authService.fetchUserInfoByUserId).toBeCalledWith(testUserUserId);
    });
  });

  describe("logout user", () => {
    const getReqMock = jest.fn(() => {
      return httpMocks.createRequest({
        user: {
          userId: testUserUserId,
        },
      });
    });
    it("should return 400", async () => {
      const response = await authController.logout(getReqMock(), getResMock());
      expect(response.statusCode).toBe(400);
      expect(response._getJSONData()).toHaveProperty("message");
      expect(authService.revokeTokenPairByUserId).toBeCalled();
      expect(authService.revokeTokenPairByUserId).toBeCalledWith(
        testUserUserId
      );
    });

    it("should return 200", async () => {
      const response = await authController.logout(getReqMock(), getResMock());
      expect(response.statusCode).toBe(200);
      expect(authService.revokeTokenPairByUserId).toBeCalled();
      expect(authService.revokeTokenPairByUserId).toBeCalledWith(
        testUserUserId
      );
    });
  });
});
