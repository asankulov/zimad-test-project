const { validationResult, body } = require("express-validator");

module.exports = async (req, res, next) => {
  await body("id")
    .trim()
    .if(
      body("id").not().isMobilePhone("any", {
        strictMode: true,
      })
    )
    .isEmail()
    .normalizeEmail()
    .run(req);
  await body("password")
    .notEmpty()
    .trim()
    .withMessage("Parameter missed")
    .run(req);
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      errors: result.array().map((err) => ({ [err.param]: err.msg })),
    });
  }
  next();
};
