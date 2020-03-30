const faker = require("faker");
const httpMocks = require("node-mocks-http");
const userBodyValidator = require("../../src/api/middlewares/userBodyValidator");

describe("User Body Validator", () => {
  const nextMock = jest.fn();
  it("should call next", async () => {
    const req = httpMocks.createRequest({
      body: {
        id: faker.internet.email(),
        password: faker.internet.password(),
      },
    });
    const res = httpMocks.createResponse();
    await userBodyValidator(req, res, nextMock);
    expect(nextMock).toBeCalledTimes(1);
  });

  it("should return 400 because of missed body parameter/parameters", async () => {
    const res = httpMocks.createResponse();
    const response1 = await userBodyValidator(
      httpMocks.createRequest({
        body: {
          id: faker.internet.email(),
        },
      }),
      res,
      nextMock
    );
    expect(response1.statusCode).toBe(400);
    expect(response1._isJSON()).toBeTruthy();

    const response2 = await userBodyValidator(
      httpMocks.createRequest({
        body: {
          password: faker.internet.password(),
        },
      }),
      res,
      nextMock
    );
    expect(response2.statusCode).toBe(400);
    expect(response2._isJSON()).toBeTruthy();

    await userBodyValidator(
      httpMocks.createRequest({
        body: {
          id: faker.random.word(),
          password: faker.internet.password(),
        },
      }),
      res,
      nextMock
    );

    expect(nextMock).not.toBeCalled();
  });

  afterEach(() => {
    nextMock.mockReset();
  });
});
