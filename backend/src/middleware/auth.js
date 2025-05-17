import jwt from 'jsonwebtoken';
import { Project, User } from '../models/index.js';

// Middleware to authenticate JWT token
export const authenticateToken = async (req, res, next) => {
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

// Middleware to require creator role
export const requireCreator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== 'CREATOR') {
    return res.status(403).json({ message: 'Access forbidden. Creator role required.' });
  }

  next();
};

// Middleware to check if user is accessing their own resource
export const isResourceOwner = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const resourceId = req.params.id;
    const resourceType = req.baseUrl.split('/').pop(); // projects, users, etc.
    
    // Different checks based on resource type
    if (resourceType === 'projects') {
      const project = await Project.findByPk(resourceId);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      if (project.userId !== req.user.id && req.user.role !== 'CREATOR') {
        return res.status(403).json({ message: 'Access forbidden. You do not own this resource.' });
      }
    }
    
    next();
  } catch (error) {
    console.error('Resource owner check error:', error);
    res.status(500).json({ message: 'Server error checking resource ownership' });
  }
}; 