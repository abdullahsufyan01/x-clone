import bcrypt from 'bcryptjs';
import cloudinary from "../config/cloudinaryConfig.js";
import Notification from "../models/notifications.model.js";
import User from "../models/user.model.js";



export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("User Profile Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const usersUonnection = async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure user is not following/unfollowing themselves
        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You cannot follow or unfollow yourself." });
        }

        // Fetch both users in parallel
        const [targetUser, currentUser] = await Promise.all([
            User.findById(id),
            User.findById(req.user._id)
        ]);

        // Check if both users exist
        if (!targetUser || !currentUser) {
            return res.status(404).json({ error: "User not found." });
        }

        // Determine if action is to follow or unfollow
        const updateAction = currentUser.following.includes(id) ? '$pull' : '$push';

        // Update follow and follower lists
        await Promise.all([
            targetUser.updateOne({ [updateAction]: { followers: req.user._id } }),
            currentUser.updateOne({ [updateAction]: { following: id } })
        ]);

        // Send notification if following
        if (updateAction === '$push') {
            const newNotification = new Notification({
                type: 'follow',
                from: req.user._id,
                to: targetUser._id
            });
            await newNotification.save();
        }

        // Respond with success message
        const message = updateAction === '$pull' ? "User unfollowed successfully." : "User followed successfully.";
        res.status(200).json({ message });

    } catch (error) {
        console.error("toggleFollow Error:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

export const suggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch users followed by the current user
        const { following } = await User.findById(userId).select("following").lean();

        // Get a random sample of users excluding the current user and those already followed
        const users = await User.aggregate([
            { $match: { _id: { $ne: userId, $nin: following } } },
            { $sample: { size: 10 } },
            { $project: { password: 0 } }  // Exclude password from the results
        ]);

        // Respond with the first 4 suggested users
        res.status(200).json(users.slice(0, 4));
        
    } catch (error) {
        console.error("Suggested Users Error:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};


export const updateUser = async (req, res) => {
    const { fullName, email, username, currentPassword, newPassword, bio, link, profileImg, coverImg } = req.body;
    const userId = req.user._id;

    try {
        // Fetch the user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Handle password update if provided
        if (currentPassword || newPassword) {
            const passwordUpdateError = await handlePasswordUpdate(user, currentPassword, newPassword);
            if (passwordUpdateError) return res.status(400).json({ error: passwordUpdateError });
        }

        // Handle profile image update if provided
        const updatedProfileImg = profileImg ? await handleImageUpdate(user.profileImg, profileImg) : user.profileImg;
        
        // Handle cover image update if provided
        const updatedCoverImg = coverImg ? await handleImageUpdate(user.coverImg, coverImg) : user.coverImg;

        // Update other user fields
        Object.assign(user, {
            fullName: fullName || user.fullName,
            email: email || user.email,
            username: username || user.username,
            bio: bio || user.bio,
            link: link || user.link,
            profileImg: updatedProfileImg,
            coverImg: updatedCoverImg
        });

        // Save updated user and nullify password in response
        const updatedUser = await user.save();
        updatedUser.password = null;

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in updateUser:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
};

// Function to handle password update
const handlePasswordUpdate = async (user, currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) {
        return "Please provide both current password and new password.";
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return "Current password is incorrect.";

    if (newPassword.length < 6) {
        return "Password must be at least 6 characters long.";
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    return null; // No error
};

// Function to handle image updates
const handleImageUpdate = async (existingImage, newImage) => {
    if (existingImage) {
        await cloudinary.uploader.destroy(getPublicIdFromUrl(existingImage));
    }

    const uploadedResponse = await cloudinary.uploader.upload(newImage);
    return uploadedResponse.secure_url;
};

// Helper function to extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
    return url.split('/').pop().split('.')[0];
};

