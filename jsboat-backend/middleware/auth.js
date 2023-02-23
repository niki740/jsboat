const jwt = require("jsonwebtoken");
const Config = require("../config");
const errObject = { status: false };

const verifyToken = async (req, res, next) => {
  try {
    if (
      !req?.headers?.authorization ||
      !req?.headers?.authorization.startsWith("Bearer") ||
      !req?.headers?.authorization.split(" ")[1]
    ) {
      res.status(500).json({
        status: false,
        message: "Please provide the token",
      });
    }
    const theToken = await req.headers.authorization.split(" ")[1];

    const decoded = await jwt.verify(theToken, Config.JWT_TOKEN_KEY);
    req.decoded = decoded;
    return next();
  } catch (err) {
    errObject.statusCode = 500;
    errObject.err = err.message;
    return errObject;
  }
};
module.exports = verifyToken;
