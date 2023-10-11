import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

// asynchronous function to determine if user is logged in
// and prevent unauthorized actions
const protectRoute = async (req, res, next) => {
  try {
    // grab the token from client's cookies
    const token = req.cookies.jwt;

    // if token is absent
    if (!token) {
      // user is unauthorized
      return res.status(401).json({ message: "Unauthorized user" });
    }

    // decode and verify the token using our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get user details except password
    const user = await User.findById(decoded.userId).select("-password");

    // assign user object to user field of request body
    req.user = user;

    // calling the next function indicates a successfull run of middleware
    next();
  } catch (err) {
    // catch any errors that show up
    // indicate them in the response
    res.status(500).json({ message: err.message });
    // and log them to the console
    console.log("Error protecting route: ", err.message);
  }
};

export default protectRoute;
