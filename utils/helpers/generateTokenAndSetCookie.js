import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  // generate token using supplied userId and our JWT_SECRET
  // this token is configured to expire in 15 days
  // after which it expires and user must sign in again
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  // in the response cookie, set the generated token to the "jwt" key
  res.cookie(
    "jwt",
    token,
    // additional options
    {
      httpOnly: true, // this cookie can't be accessed by browser, making it more secure
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
      sameSite: "strict", // CSRF protection
    }
  );

  // return this generated token
  return token;
};

export default generateTokenAndSetCookie;
