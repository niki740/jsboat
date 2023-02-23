const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/auth.route");
const placeRoute = require("./routes/places.route");

module.exports = (app, db, io) => {
  const handleDB = (req, res, next) => {
    req.db = db;
    req.io = io;
    next();
  };
  app.use(cors());

  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(handleDB);
  app.use("/api/v1", authRoute);
  app.use("/api/v1", placeRoute);
};
