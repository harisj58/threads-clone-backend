import mongoose from "mongoose";

// define the blueprint of a user
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    followers: {
      type: [String],
      default: [],
    },
    following: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // allows automatic creation of timestamps
  }
);

// create a user model using the defined schema
// the model name will be lowercased and pluralized when added to the db
// so "User" will show up as "users" in the database
const User = mongoose.model("User", userSchema);
export default User;
