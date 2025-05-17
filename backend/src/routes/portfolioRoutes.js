import express from 'express';
import { getUserPortfolio, getUserProject } from '../controllers/portfolioController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Optional authentication for tracking analytics
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(); // Continue without authentication
  }

  // Use existing authenticateToken middleware
  authenticateToken(req, res, next);
};

// Get portfolio by username (public)
router.get('/:username', optionalAuth, getUserPortfolio);

// Get specific project from a user's portfolio (public)
router.get('/:username/projects/:projectId', optionalAuth, getUserProject);

export default router; 