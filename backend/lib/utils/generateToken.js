import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const generateTokenAndSetCookie = (userId, res) => {
    // Create a JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d' // Token expires in 1 day
    });

    // Set the token in an HTTP-only cookie
    res.cookie('jwt', token, {
        httpOnly: true, // Prevent JavaScript from accessing the cookie
        secure: process.env.NODE_ENV !== 'development', // Only use HTTPS in non-development environments
        maxAge: 24 * 60 * 60 * 1000, // Cookie expiration: 1 day
        sameSite: 'strict' // Prevents the cookie from being sent with cross-site requests
    });
}
