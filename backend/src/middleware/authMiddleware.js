import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// Required JWT authentication middleware
export const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    
    jwt.verify(token, jwtSecret, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      // Check if user exists in database
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found. Please log in again.' });
      }

      // Add user info to request
      req.user = {
        id: decoded.id,
        role: decoded.role
      };
      
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

// Optional JWT authentication middleware
export const optionalAuthenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      // Continue without authentication
      return next();
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
    
    jwt.verify(token, jwtSecret, async (err, decoded) => {
      if (err) {
        // Invalid token, but continue as unauthenticated
        return next();
      }

      // Check if user exists in database
      const user = await User.findByPk(decoded.id);
      if (user) {
        // Add user info to request
        req.user = {
          id: decoded.id,
          role: decoded.role
        };
      }
      
      next();
    });
  } catch (error) {
    console.error('Optional authentication error:', error);
    // Continue without authentication on error
    next();
  }
}; 