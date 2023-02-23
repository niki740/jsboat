const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Config = require("../config");
const Service = {};

// User Register Service
Service.RegisterUser = async (req) => {
  try {
    const { db, body } = req;
    const { name, email, password, prefrered_states } = body;
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const isUserExists = await db.checkUserExistWithEmail([body.email]);
    if (isUserExists?.rows && isUserExists?.rows[0]?.id) {
      return {
        statusCode: 400,
        status: false,
        message: "User already registered with email",
      };
    }

    const data = await db.addUser([name, email, hash, prefrered_states]);
    return {
      statusCode: 200,
      status: true,
      message: "Customer registered successfully",
      data,
    };
  } catch (err) {
    return {
      statusCode: 500,
      status: false,
      message: err.message,
    };
  }
};

// User Login Service
Service.SignInUser = async (req) => {
  try {
    const { db, body } = req;
    const { email, password } = body;
    const isUserExists = await db.loginUser([email]);
    if (!isUserExists?.rows && !isUserExists?.rows[0]?.id) {
      return {
        statusCode: 400,
        status: false,
        message: "User Not Found",
      };
    }
    const validPass = await bcrypt.compare(
      password,
      isUserExists.rows[0].password
    );
    if (validPass === true) {
      const token = jwt.sign(
        { id: isUserExists?.rows[0]?.id },
        Config.JWT_TOKEN_KEY,
        {
          expiresIn: "24h",
        }
      );
      delete isUserExists.rows[0].password;
      return {
        statusCode: 200,
        status: false,
        message: "Sign in successfully",
        token,
        data: isUserExists.rows[0],
      };
    }
    return {
      statusCode: 400,
      status: false,
      message: "Invalid credentials",
    };
  } catch (err) {
    return {
      statusCode: 500,
      status: false,
      message: err.message,
    };
  }
};

module.exports = Service;
