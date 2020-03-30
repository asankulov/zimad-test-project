const faker = require("faker");
const httpMocks = require("node-mocks-http");
const refreshTokenBodyValidator = require("../../src/api/middlewares/refreshTokenBodyValidator");

describe("Refresh Token Body Validator", () => {
  const nextMock = jest.fn();

  it("should call next", async () => {
    const req = httpMocks.createRequest({
      body: {
        refreshToken: faker.random.uuid(),
      },
    });
    const res = httpMocks.createResponse();
    await refreshTokenBodyValidator(req, res, nextMock);
    expect(nextMock).toBeCalledTimes(1);
  });

  it("should return 400", async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const response = await refreshTokenBodyValidator(req, res, nextMock);
    expect(response.statusCode).toBe(400);
    expect(response._isJSON()).toBeTruthy();
    expect(nextMock).not.toBeCalled();
  });

  afterEach(() => {
    nextMock.mockReset();
  });
});
