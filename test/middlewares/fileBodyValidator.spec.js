const httpMocks = require("node-mocks-http");
const fileBodyValidator = require("../../src/api/middlewares/fileBodyValidator");

describe("File Body Validator", () => {
  const nextMock = jest.fn();
  const getResMock = jest.fn(() => httpMocks.createResponse());

  it("should call next", async () => {
    const req = httpMocks.createRequest({
      file: {},
    });
    await fileBodyValidator(req, getResMock(), nextMock);
    expect(nextMock).toBeCalledTimes(1);
  });

  it("should return 400", async () => {
    const req = httpMocks.createRequest();
    const response = await fileBodyValidator(req, getResMock(), nextMock);
    expect(response.statusCode).toBe(400);
    expect(response._isJSON()).toBeTruthy();
    expect(nextMock).not.toBeCalled();
  });

  afterEach(() => {
    nextMock.mockReset();
  });
});
