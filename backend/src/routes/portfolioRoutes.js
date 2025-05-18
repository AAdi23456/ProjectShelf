import express from 'express';
import { getUserPortfolio, getUserProject, getPublishedPortfolios } from '../controllers/portfolioController.js';
import { optionalAuthenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all published portfolios
router.get('/published', getPublishedPortfolios);

// Get portfolio by username (public)
router.get('/:username', optionalAuthenticateJWT, getUserPortfolio);

// Get specific project from a user's portfolio (public)
router.get('/:username/projects/:projectId', optionalAuthenticateJWT, getUserProject);

export default router; 