import Post from "../models/postModel.js";
import User from "../models/userModel.js";

// asynchronous function to create a post
const createPost = async (req, res) => {
  try {
    // grab required info from request body
    const { postedBy, text, img } = req.body;

    // if the user posting or the text is missing
    if (!postedBy || !text) {
      // indicate failure as they are necessary for posting
      return res
        .status(400)
        .json({ message: "Insufficient data to create a post" });
    }

    // get user details by searching using his ID
    const user = await User.findById(postedBy);
    // console.log(user);

    // if no such user is found
    if (!user) {
      // indicate failure in response
      return res.status(404).json({ message: "User not found" });
    }

    // if the posting user ID does not match the ID of current logged in user
    if (user._id.toString() !== req.user._id.toString()) {
      // indicate failure in response as user cannot post on someone else's
      // behalf
      return res.status(401).json({ message: "Unauthorized to create a post" });
    }

    // define max length for post as per post schema
    const maxLength = 500;
    // if the post's text's length exceeds it
    if (text.length > maxLength) {
      // indicate failure in response
      return res
        .status(400)
        .json({ message: `Text must be less than ${maxLength} characters` });
    }

    // create a new post using the details
    const newPost = new Post({
      postedBy,
      text,
      img,
    });

    // await addition of new post to database
    await newPost.save();

    // indicate success in response
    return res
      .status(201)
      .json({ message: "Post created successfully", newPost });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error creating a post: ", err.message);
  }
};

// asynchronous function to get a post from DB
const getPost = async (req, res) => {
  try {
    // get post using post ID from request parameters
    const post = await Post.findById(req.params.id);

    // if no such post exists
    if (!post) {
      // indicate failure in response
      return res.status(404).json({ message: "Post not found" });
    }

    // indicate success in response
    return res.status(200).json({ message: "Post found", post });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error getting post: ", err.message);
  }
};

// asynchronous function to delete a post
const deletePost = async (req, res) => {
  try {
    // get the post using the post ID from request parameters
    const post = await Post.findById(req.params.id);

    // if no such post exists
    if (!post) {
      // indicate failure in response
      return res.status(404).json({ message: "Post not found" });
    }

    // if the current user ID does not match the ID of the post creator
    if (post.postedBy.toString() !== req.user._id.toString()) {
      // indicate failure as a user may not delete someone else's post
      return res.status(400).json({ message: "Unauthorized to delete post" });
    }

    // await deletion of post using post ID
    await Post.findByIdAndDelete(req.params.id);

    // indicate success in response
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error deleting post: ", err.message);
  }
};

// asynchronous function to toggle like/unlike of a post
const likeUnlikePost = async (req, res) => {
  try {
    // get post ID from request parameters
    const postId = req.params;
    // get user ID from user object
    const userId = req.user._id;

    // find a post having the same post ID
    const post = await Post.findById(postId);

    // if no such post exists
    if (!post) {
      // indicate failure in response
      return res.status(404).json({ message: "Post not found" });
    }

    // check if user has already liked the post
    const userLikedPost = post.likes.includes(userId);

    // if he has
    if (userLikedPost) {
      // Unlike post by pulling his user ID from post likes
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // Like post by pushing his user ID into post likes
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error liking/unliking post: ", err.message);
  }
};

// asynchronous function to reply to a post
const replyToPost = async (req, res) => {
  try {
    // grab the reply text from request body
    const { text } = req.body;
    // grab post ID from request parameters
    const postId = req.params.id;
    // grab remaining details from user object
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    // if the reply has no text
    if (!text) {
      // indicate failure in response
      return res.status(400).json({ message: "Text field is required" });
    }

    // grab the relevant post using the post ID
    const post = await Post.findById(postId);

    // if no such post exists
    if (!post) {
      // indicate failure in response
      return res.status(404).json({ message: "No such post found" });
    }

    // form the reply object as per definition in post schema
    const reply = { userId, text, userProfilePic, username };

    // await pushing of reply object in post details and saving
    await post.replies.push(reply);
    await post.save();

    // indicate success in response
    return res.status(200).json({ message: "Reply added successfully", post });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error replying to post: ", err.message);
  }
};
// asynchronous function to get feed of a user
const getFeedPosts = async (req, res) => {
  try {
    // get user ID of currently logged in user
    const userId = req.user._id;
    // get user details by searching using his ID
    const user = await User.findById(userId);

    // if no such user exists
    if (!user) {
      // indicate failure in response
      return res.status(404).json({ message: "No such user found" });
    }

    // grab the following list from user details
    const following = user.following;

    // get the feed posts which are posted by the people in current user's
    // following list and sorted in reverse chronological order (latest first)
    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    // indicate success in response along with the feed posts
    return res.status(200).json({ feedPosts });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error getting feed posts: ", err.message);
  }
};

export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
};
