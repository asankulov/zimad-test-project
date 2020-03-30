const router = require("express").Router();
const isAuthenticated = require("./middlewares/isAuthenticated");
const fileRoutes = require("./routes/file");
const authRoutes = require("./routes/auth");

router.use("/auth", authRoutes);
router.use("/file", isAuthenticated, fileRoutes);

module.exports = router;
