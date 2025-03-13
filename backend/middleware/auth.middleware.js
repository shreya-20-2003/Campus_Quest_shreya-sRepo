// server/middleware/authMiddleware.js

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

/**
 * Middleware to authenticate and authorize users via JWT token.
 */
const authMiddleware = (req, res, next) => {
    try {
        // Extract Authorization header
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access denied. No token provided or invalid format.' });
        }

        // Extract token from "Bearer TOKEN"
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request object
        req.user = decoded;
        next(); // Proceed to the next middleware
    } catch (error) {
        // Handle token errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Session expired. Please log in again.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Invalid token. Authorization failed.' });
        }

        console.error('JWT Authentication Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export default authMiddleware;
