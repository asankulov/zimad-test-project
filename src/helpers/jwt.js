const jwt = require("jsonwebtoken");
const config = require("../config");
const Session = require("../models").Session;

module.exports = {
  generateNewToken(payload) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        config.jwt.secret,
        {
          expiresIn: config.jwt.accessTokenLifeTime,
        },
        (err, token) => {
          if (err) {
            return reject(err);
          }
          return resolve(token);
        }
      );
    });
  },
  verifyToken(token) {
    return new Promise(async (resolve, reject) => {
      const session = await Session.findOne({
        where: {
          accessToken: token,
        },
        attributes: ["id"],
      });
      if (!session) {
        return reject("Invalid Token.");
      }
      jwt.verify(token, config.jwt.secret, (error, decoded) => {
        if (error) {
          return reject(error);
        }
        session.save();
        return resolve(decoded);
      });
    });
  },
};
