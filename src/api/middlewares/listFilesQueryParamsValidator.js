const { query, validationResult } = require("express-validator");

module.exports = async (req, res, next) => {
  await query("page")
    .optional({
      nullable: true,
    })
    .isInt({
      gt: 0,
    })
    .toInt()
    .run(req);
  await query("listSize")
    .optional({
      nullable: true,
    })
    .isInt({
      gt: 0,
    })
    .toInt()
    .run(req);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      errors: result.array().map((err) => ({ [err.param]: err.msg })),
    });
  }
  next();
};
