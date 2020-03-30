const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const config = require("../config");
const api = require("../api");

const app = express();

app.use(logger(config.logs.level));

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send(new Date());
});

app.use(config.api.prefix, api);

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(err.status).send({ message: err.message }).end();
  }
  return next(err);
});
app.use((err, req, res, _) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
    },
  });
});

module.exports = app;
