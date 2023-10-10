import mongoose from "mongoose";

// define the blueprint of our post
const postSchema = mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      maxLength: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: number,
      default: 0,
    },
    replies: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        userProfilePic: {
          type: String,
        },
        username: { type: String },
      },
    ],
  },
  {
    timestamps: true, // allows automatic creation of timestamps
  }
);

// create a post model using the defined schema
// the model name will be lowercased and pluralized when added to the db
// so "Post" will show up as "posts" in the database
const Post = mongoose.model("Post", postSchema);
export default Post;
