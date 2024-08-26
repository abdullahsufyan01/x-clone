import Post from '../models/posts.model.js'
import User from '../models/user.model.js';
import Notification from "../models/notifications.model.js";
import cloudinary from "../config/cloudinaryConfig.js";



export const createPost = async (req, res) => {
    try {
        const { descriptionText, postImg: imgData } = req.body;
        const userId = req.user._id;

        // Validate user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Validate post content
        if (!descriptionText && !imgData) {
            return res.status(400).json({ error: "Post must contain descriptionText or an image" });
        }

        let imageUrl;

        // Upload image to Cloudinary if present
        if (imgData) {
            const uploadResult = await cloudinary.v2.uploader.upload(imgData);
            imageUrl = uploadResult.secure_url;
        }

        // Create and save the new post
        const newPost = new Post({
            user: userId,
            descriptionText,
            postImg: imageUrl,
        });

        await newPost.save();

        res.status(201).json({
            message: "Post created successfully",
            post: newPost,
        });

    } catch (error) {
        console.error("Error in createPost controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deletePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		// Find the post by ID
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		// Check if the post belongs to the current user
		if (post.user.toString() !== userId.toString()) {
			return res.status(403).json({ error: "You are not authorized to delete this post" });
		}

		// If post has an image, delete it from Cloudinary
		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		// Delete the post
		await Post.findByIdAndDelete(postId);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.error("Error in deletePost controller:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const postComments = async (req, res) => {
	try {
		const { text } = req.body;
		const { id: postId } = req.params;
		const userId = req.user._id;

		// Validate request
		if (!text || !text.trim()) {
			return res.status(400).json({ error: "Comment text is required." });
		}

		// Find the post by ID
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found." });
		}

		// Create the comment
		const comment = { user: userId, text: text.trim() };

		// Add comment to the post
		post.comments.push(comment);
		await post.save();

		res.status(200).json({ message: "Comment added successfully.", post });
	} catch (error) {
		console.error("Error in postComments controller:", error.message);
		res.status(500).json({ error: "Internal server error." });
	}
};

export const togglePostReaction = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id: postId } = req.params;

		// Find the post by ID
		const post = await Post.findById(postId).populate('user');
		if (!post) {
			return res.status(404).json({ error: "Post not found." });
		}

		// Check if the user has already liked the post
		const hasLiked = post.likes.includes(userId);

		if (hasLiked) {
			// Unlike post
			post.likes = post.likes.filter(id => id.toString() !== userId.toString());
			await post.save();

			// Remove post from user's liked posts
			await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

			return res.status(200).json({ message: "Post unliked successfully.", likes: post.likes });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();

			// Add post to user's liked posts
			await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });

			// Create a notification
			const notification = new Notification({
				from: userId,
				to: post.user._id,
				type: "like",
				post: postId,
			});
			await notification.save();

			return res.status(200).json({ message: "Post liked successfully.", likes: post.likes });
		}
	} catch (error) {
		console.error("Error in likeUnlikePost controller:", error.message);
		res.status(500).json({ error: "Internal server error." });
	}
};

export const getAllPosts = async (req, res) => {
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		if (posts.length === 0) {
			return res.status(200).json([]);
		}

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getAllPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getLikedPosts = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(likedPosts);
	} catch (error) {
		console.log("Error in getLikedPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getFollowingPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const following = user.following;

		const feedPosts = await Post.find({ user: { $in: following } })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(feedPosts);
	} catch (error) {
		console.log("Error in getFollowingPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserPosts = async (req, res) => {
	try {
		const { username } = req.params;

		const user = await User.findOne({ username });
		if (!user) return res.status(404).json({ error: "User not found" });

		const posts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getUserPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};