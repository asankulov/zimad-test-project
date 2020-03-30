const faker = require("faker");
const httpMocks = require("node-mocks-http");
const listFilesQueryParamsValidator = require("../../src/api/middlewares/listFilesQueryParamsValidator");

describe("List Files Query Params Validator", () => {
  const nextMock = jest.fn();
  const res = httpMocks.createResponse();

  it("should call next", async () => {
    const req = httpMocks.createRequest({
      query: {
        page: faker.random.number({
          min: 1,
        }),
        listSize: faker.random.number({
          min: 1,
        }),
      },
    });
    await listFilesQueryParamsValidator(req, res, nextMock);
    await listFilesQueryParamsValidator(
      httpMocks.createRequest(),
      res,
      nextMock
    );
    expect(nextMock).toBeCalledTimes(2);
  });

  it("should return 400", async () => {
    const req = httpMocks.createRequest({
      query: {
        page: faker.random.number(0),
      },
    });
    const response1 = await listFilesQueryParamsValidator(req, res, nextMock);
    expect(response1.statusCode).toBe(400);
    expect(response1._isJSON()).toBeTruthy();

    const response2 = await listFilesQueryParamsValidator(
      httpMocks.createRequest({
        query: {
          listSize: faker.random.word(),
        },
      }),
      res,
      nextMock
    );
    expect(response2.statusCode).toBe(400);
    expect(response2._isJSON()).toBeTruthy();

    expect(nextMock).not.toBeCalled();
  });

  afterEach(() => {
    nextMock.mockReset();
  });
});
