const faker = require("faker");
const httpMocks = require("node-mocks-http");
const isAuthenticated = require("../../src/api/middlewares/isAuthenticated");
const jwtHelper = require("../../src/helpers/jwt");

describe("Is Authenticated middleware", () => {
  const nextMock = jest.fn();
  const getCorrectReqMock = jest.fn(() => {
    return httpMocks.createRequest({
      headers: {
        authorization: `Bearer ${faker.random.uuid()}`,
      },
    });
  });
  const getResMock = jest.fn(() => httpMocks.createResponse());

  it("should call next", async () => {
    jwtHelper.verifyToken = jest
      .fn()
      .mockResolvedValueOnce({ userId: faker.random.number({ min: 0 }) });
    await isAuthenticated(getCorrectReqMock(), getResMock(), nextMock);
    expect(nextMock).toBeCalledTimes(1);
  });

  describe("Wrong cases", () => {
    it("should return 401", async () => {
      const response = await isAuthenticated(
        httpMocks.createRequest(),
        getResMock(),
        nextMock
      );
      expect(response.statusCode).toBe(401);
      expect(nextMock).not.toBeCalled();
    });

    it("should return 400", async () => {
      jwtHelper.verifyToken = jest.fn().mockRejectedValueOnce("Some Error.");
      const response = await isAuthenticated(
        getCorrectReqMock(),
        getResMock(),
        nextMock
      );
      expect(response.statusCode).toBe(400);
      expect(nextMock).not.toBeCalled();
    });
  });

  afterEach(() => {
    nextMock.mockReset();
  });
});
