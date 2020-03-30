const { validationResult, body } = require("express-validator");

module.exports = async (req, res, next) => {
  await body("refreshToken")
    .notEmpty({
      ignore_whitespace: true,
    })
    .trim()
    .run(req);
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      errors: result.array().map((err) => ({
        [err.param]: err.msg,
      })),
    });
  }
  next();
};
