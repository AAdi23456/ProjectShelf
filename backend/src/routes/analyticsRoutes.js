import express from 'express';
import { 
  recordProjectView, 
  recordPortfolioVisit,
  getProjectViewStats,
  getPortfolioVisitStats
} from '../controllers/analyticsController.js';
import { authenticateJWT, optionalAuthenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (authentication optional)
router.post('/project-view', optionalAuthenticateJWT, recordProjectView);
router.post('/portfolio-visit', optionalAuthenticateJWT, recordPortfolioVisit);

// Protected routes (require authentication)
router.get('/project-views', authenticateJWT, getProjectViewStats);
router.get('/portfolio-visits', authenticateJWT, getPortfolioVisitStats);

export default router; 