import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";

// asynchronous function to sign up the user
const signupUser = async (req, res) => {
  try {
    // grab the name, email, username and password from the req body
    const { name, email, username, password } = req.body;
    // check if any other user with the same username or email
    // is present in the database already
    const user = await User.findOne({ $or: [{ email }, { username }] });

    // if there is such a user
    if (user) {
      // stop the signup and indicate it in the response
      return res.status(400).json({ error: "User already exists" });
    }
    // generate the password salt using bcrypt with `10` rounds
    const salt = await bcrypt.genSalt(10);
    // hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a new user with the supplied credentials
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
      bio: "",
      profilePic: "",
    });
    // await the addition of user inside the database
    await newUser.save();

    // if a new user is generated successfully
    if (newUser) {
      // generate a JWT token and send it to browser to store as a cookie
      generateTokenAndSetCookie(newUser._id, res);

      // display user details in the response
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      // otherwise indicate failure in the response
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (err) {
    // catch any errors that show up
    // indicate them in the response
    res.status(500).json({ error: err.message });
    // and log them to the console
    console.log("Error signing up user: ", err.message);
  }
};

// asynchronous function to log in the user
const loginUser = async (req, res) => {
  try {
    // get the email, username and password from request body
    const { email, username, password } = req.body;
    // find a user with the same email or username
    const user = await User.findOne({ $or: [{ email }, { username }] });
    // console.log(user);

    // check if the password is correct by comparing the given
    // password with the hashed password in user
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    // if user does not exist or if the password is not correct
    if (!user || !isPasswordCorrect) {
      // indicate log in failure in response
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // generate a JWT token and send it to browser to store as a cookie
    generateTokenAndSetCookie(user._id, res);

    // indicate user details in response once logged in
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (err) {
    // catch any errors that show up
    // indicate them in the response
    res.status(500).json({ error: err.message });
    // log them to the console
    console.log("Error logging in: ", err.message);
  }
};

// asynchronous function to log out the user
const logoutUser = async (req, res) => {
  try {
    // clear the cookie with the key "jwt" by replacing it with "" in 1 ms
    res.cookie("jwt", "", { maxAge: 1 });
    // indicate log out success in response
    res.status(200).json({ message: "User logged out successfully!" });
  } catch (err) {
    // catch any errors that show up
    // indicate them in response
    res.status(500).json({ error: err.message });
    // log them to the console
    console.log("Error signing in: ", err.message);
  }
};

// asynchronous function to toggle follow/unfollow of a user
const followUnfollowUser = async (req, res) => {
  try {
    // get the id of user to follow from request parameters
    const { id } = req.params;
    // userToModify is the user we wish to toggle follow
    const userToModify = await User.findById(id);
    // currentUser is the one requesting to toggle the follow
    const currentUser = await User.findById(req.user._id);

    // if the user wishes to follow themselves
    if (id === req.user._id.toString())
      // indicate failure in response as this is not valid
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself!" });

    // if either userToModify or the currentUser are null
    if (!userToModify || !currentUser)
      // indicate failure in response
      return res.status(400).json({ error: "User to follow not found" });

    // check if the currentUser is already following userToModify
    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // if the user is already following the requested user
      // unfollow him by

      // modify the following list of current user
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      // modify followers of userToModify
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });

      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // if the user is not yet following the requested user
      // follow him by

      // modify the following list of current user
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      // modify followers of userToModify
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (err) {
    // catch any errors that show up
    // indicate them in response
    res.status(500).json({ error: err.message });
    // log them in the console
    console.log("Error following user: ", err.message);
  }
};

// asynchronous function to update user profile details
const updateUser = async (req, res) => {
  // grab the following credentials from the request body
  const { name, email, username, password, profilePic, bio } = req.body;
  // grab the userId of currently signed in user
  const userId = req.user._id;

  try {
    // find and get a user using the id `userId`
    let user = await User.findById(userId);
    // if no such user is found
    if (!user) {
      // indicate failure in response
      return res.status(400).json({ error: "User not found" });
    }

    // Check if the account being modified belongs to the user signed in
    if (req.params.id !== userId.toString()) {
      // if not, forbid modification
      return res
        .status(400)
        .json({ error: "You cannot update other's profile" });
    }

    // if password is present in request body
    if (password) {
      // generate salt with `10` rounds
      const salt = await bcrypt.genSalt(10);
      // get hashed password using salt
      const hashedPassword = await bcrypt.hash(password, salt);
      // update user password
      user.password = hashedPassword;
    }

    // update the rest of the properties if present in request body
    user.name = name || user.name;
    user.email = email || user.email;
    user.profilePic = profilePic || user.profilePic;
    user.username = username || user.username;
    user.bio = bio || user.bio;

    // await updation of user details in database
    user = await user.save();

    // indicate success in response
    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    //catch any errors that show up
    // indicate them in response
    res.status(500).json({ error: err.message });
    // log them to console
    console.log("Error updating profile: ", err.message);
  }
};

// asynchronous function to get the profile of a user
const getUserProfile = async (req, res) => {
  // get the username from request parameters
  const { username } = req.params;

  try {
    // find a user with the supplied username without the password and
    // updatedAt fields
    const user = await User.findOne({ username })
      .select("-password")
      .select("-updatedAt");

    // if no such user exists
    if (!user) {
      // indicate failure in response
      return res.status(400).json({ error: "No such user found" });
    }

    // otherwise indicate success and send user details
    res.status(200).json(user);
  } catch (err) {
    // catch any errors that show up
    // indicate them in response
    res.status(500).json({ error: err.message });
    // log them to the console
    console.log("Error getting profile: ", err.message);
  }
};

export {
  signupUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile,
};
