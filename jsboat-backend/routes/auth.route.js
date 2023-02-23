const app = require("express");
const AuthService = require("../services/auth.service");
const { filterResp } = require("../helpers/function");
const router = app.Router();

const ApiService = {
  RegisterUser: async (req, res) => {
    const resp = await AuthService.RegisterUser(req);
    res.status(resp.statusCode).json(filterResp(resp));
  },
  SignInUser: async (req, res) => {
    const resp = await AuthService.SignInUser(req);
    res.status(resp.statusCode).json(filterResp(resp));
  },
};

router
  .post("/register", ApiService.RegisterUser)
  .post("/login", ApiService.SignInUser);

module.exports = router;
