const models = require("../models");
let User = models.User;
let Session = models.Session;
let sequelize = models.sequelize;
let jwtHelper = require("../helpers/jwt");

module.exports = {
  async createNewUser(data) {
    const transaction = await sequelize.transaction();
    try {
      let user = await User.findOne({
        where: {
          id: data.id,
        },
        attributes: ["userId"],
      });
      if (user !== null) {
        return Promise.reject("ID has already taken.");
      }
      user = await User.create(data, { transaction });
      const userId = user.get("userId");
      const accessToken = await jwtHelper.generateNewToken({
        userId,
      });
      const session = await Session.create(
        {
          userId,
          accessToken,
        },
        { transaction }
      );
      transaction.commit();
      return {
        accessToken,
        refreshToken: session.get("refreshToken"),
      };
    } catch (e) {
      transaction.rollback();
      throw e;
    }
  },
  async processLogin(data) {
    try {
      const user = await User.findOne({
        where: {
          id: data.id,
        },
      });
      if (!user || !(await user.comparePassword(data.password))) {
        return Promise.reject("Invalid id/password.");
      }
      const userId = user.get("userId");
      const accessToken = await jwtHelper.generateNewToken({
        userId,
      });
      const session = await Session.create({
        userId,
        accessToken,
      });

      return {
        accessToken,
        refreshToken: session.get("refreshToken"),
      };
    } catch (e) {
      throw e;
    }
  },
  async generateNewTokenPair(refreshToken) {
    try {
      const session = await Session.findOne({
        where: {
          refreshToken,
        },
        attributes: [
          "id",
          "userId",
          "refreshToken",
          "accessToken",
          "expiresAt",
        ],
      });
      if (!session || session.isRefreshTokenExpired()) {
        return Promise.reject("Invalid refreshToken.");
      }
      const accessToken = await jwtHelper.generateNewToken({
        userId: session.get("userId"),
      });
      session.set("accessToken", accessToken);
      session.save();

      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      throw e;
    }
  },
  async fetchUserInfoByUserId(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: ["id"],
      });
      if (!user) {
        return Promise.reject("User info not found.");
      }
      return {
        id: user.get("id"),
      };
    } catch (e) {
      throw e;
    }
  },
  async revokeTokenPairByUserId(userId) {
    try {
      const destroyedNumber = await Session.destroy({
        where: {
          userId,
        },
      });
      return destroyedNumber > 0;
    } catch (e) {
      throw e;
    }
  },
};
