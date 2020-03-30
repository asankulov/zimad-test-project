const jwtHelper = require("../../helpers/jwt");

module.exports = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1].trim();
    try {
      const decoded = await jwtHelper.verifyToken(token);
      req.user = {
        userId: decoded.userId,
      };
      next();
    } catch (error) {
      return res.status(400).json({
        error,
      });
    }
  } else {
    return res.sendStatus(401);
  }
};
