const authService = require("../../services/auth");

module.exports = {
  async signUp(req, res) {
    try {
      const tokenPair = await authService.createNewUser(req.body);
      return res.status(201).json(tokenPair);
    } catch (error) {
      if (error === "ID has already taken.") {
        return res.status(400).json({
          message: error,
        });
      }
      throw error;
    }
  },
  async signIn(req, res) {
    try {
      const tokenPair = await authService.processLogin(req.body);
      return res.status(200).json(tokenPair);
    } catch (error) {
      if (error === "Invalid id/password.") {
        return res.status(400).json({
          message: error,
        });
      }
      throw error;
    }
  },
  async getNewTokenPair(req, res) {
    try {
      const tokenPair = await authService.generateNewTokenPair(
        req.body.refreshToken
      );
      return res.status(200).json(tokenPair);
    } catch (error) {
      if (error === "Invalid refreshToken.") {
        return res.status(400).json({
          message: error,
        });
      }
      throw error;
    }
  },
  async getUserInfo(req, res) {
    try {
      const userInfo = await authService.fetchUserInfoByUserId(req.user.userId);
      return res.status(200).json(userInfo);
    } catch (error) {
      if (error === "User info not found.") {
        return res.status(400).json({
          message: error,
        });
      }
      throw error;
    }
  },
  async logout(req, res) {
    try {
      const result = await authService.revokeTokenPairByUserId(req.user.userId);
      if (result) {
        return res.sendStatus(200);
      }
      return res.status(400).json({
        message: "Already logout.",
      });
    } catch (error) {
      throw error;
    }
  },
};
