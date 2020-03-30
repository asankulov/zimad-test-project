const path = require("path");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  const dotenv = require("dotenv");
  const envFound = dotenv.config();
  if (!envFound) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
  }
}

module.exports = {
  port: parseInt(process.env.PORT, 10),
  logs: {
    level: process.env.LOG_LEVEL || "short",
  },
  sequelize: require("./sequelize"),
  api: {
    prefix: "/api",
  },
  jwt: {
    accessTokenLifeTime: "10m",
    refreshTokenLifeTime: "2h",
    secret: process.env.JWT_SECRET,
  },
  baseDir: path.resolve(__dirname, "../.."),
};
