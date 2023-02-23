require("dotenv").config();
const ENV = process.env;

const Config = {
  DB_USER: ENV.DB_USER || "demoTest",
  DB_PASSWORD: ENV.DB_PASSWORD,
  DB_DATABASE: ENV.DB_DATABASE,
  DB_PORT: ENV.DB_PORT || "5432",
  PORT: ENV.PORT || "3007",
  BASE_URL: ENV.BASE_URL || "http://localhost:3005/",
  JWT_TOKEN_KEY: ENV.JWT_TOKEN_KEY,
};

module.exports = Config;
