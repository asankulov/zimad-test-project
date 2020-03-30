const router = require("express").Router();
const authController = require("../controllers/auth");
const refreshTokenBodyValidator = require("../middlewares/refreshTokenBodyValidator");
const userBodyValidator = require("../middlewares/userBodyValidator");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/sign-up", userBodyValidator, authController.signUp);
router.post("/sign-in", userBodyValidator, authController.signIn);
router.post(
  "/sign-in/new-token",
  refreshTokenBodyValidator,
  authController.getNewTokenPair
);
router.get("/info", isAuthenticated, authController.getUserInfo);
router.get("/logout", isAuthenticated, authController.logout);

module.exports = router;
