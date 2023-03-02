const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
//to handle errors
const asyncHandler = require("express-async-handler");
require('dotenv').config();


const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // console.log("token outside try")

    try {
        // console.log("token inside try")
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   console.log(process.env.JWT_SECRET);
    //   console.log(decoded);

      req.user = await User.findById(decoded.id).select("-password");
      // console.log("id",req.user._id.valueOf())
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };