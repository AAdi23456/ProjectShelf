import express from 'express';
import { getUserPortfolio, getUserProject, getPublishedPortfolios } from '../controllers/portfolioController.js';
import { authenticateToken } from '../middleware/auth.js';
import { trackView, trackEngagement } from '../controllers/analyticsController.js';

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

// Get all published portfolios
router.get('/published', getPublishedPortfolios);

// Get portfolio by username (public)
router.get('/:username', optionalAuth, getUserPortfolio);

// Get specific project from a user's portfolio (public)
router.get('/:username/projects/:projectId', optionalAuth, getUserProject);

// Analytics tracking routes
router.post('/analytics/view', trackView);
router.post('/analytics/engagement', trackEngagement);

export default router; 