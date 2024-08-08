import Post from "../models/Post.js";
import User from "../models/User.js";

//  create
export const createPost = async (req, res) => {
  try {
    const { userId, description, Path } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPath: user.Path,
      Path,
      likes: {},
      comments: [],
    });

    await newPost.save();
    const post = Post.find(); // grabs all the posts

    res.status(201).json(post); // returns all the posts
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

//  READ
export const getFeedPosts = async (req, res) => {
  try {
    const post = Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId); // deletes the like if the post is already liked
    } else {
      post.likes.set(userId, true); // adds the user Id to liked posts if it wasn't there
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id, // the id of the post to be updated.
      { likes: post.likes }, // this is the property that is being changed/updated.
      { new: true } // this line returns the updated likes not the original one to the front-end
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
