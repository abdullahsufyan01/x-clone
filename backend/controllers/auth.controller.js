import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
    const { username, fullName, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    try {
        // Validate email
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Check for existing username and email
        const [userByUsername, userByEmail] = await Promise.all([
            User.findOne({ username }),
            User.findOne({ email })
        ]);

        if (userByUsername) {
            return res.status(400).json({ error: "Username already exists" });
        }
        if (userByEmail) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        generateTokenAndSetCookie(newUser._id, res);

        // Respond with user data
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg
        });

    } catch (error) {
        console.error("Signup Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        // Log incoming request for debugging
        console.log("Login request body:", req.body);

        // Find user by email or username
        const user = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });

        // Log the result of the query
        console.log("User found:", user);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate token and set cookie
        generateTokenAndSetCookie(user._id, res);

        // Respond with user data
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 0,
            sameSite: 'strict'
        });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
         console.error("Logout Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};