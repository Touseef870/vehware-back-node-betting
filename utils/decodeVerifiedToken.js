import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function decodeVerifiedToken(token) {
    const tokenSplit = token.split(' ')[1];
    try {
        const decoded = jwt.verify(tokenSplit, process.env.JWT_SECRET);
        if (decoded && decoded._id) {
            return decoded; 
        }
    } catch (err) {
        console.error("Token verification failed:", err.message);
        return null; 
    }
    return null;
}
