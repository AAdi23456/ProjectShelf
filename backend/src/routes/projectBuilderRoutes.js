import express from 'express';
import { authenticateToken, requireCreator } from '../middleware/auth.js';
import { 
  saveProjectDraft,
  publishProject,
  unpublishProject,
  addProjectMedia,
  deleteProjectMedia,
  updateProjectTimeline,
  updateProjectTechnologies,
  updateProjectOutcomes,
  getProjectForEditing
} from '../controllers/projectBuilderController.js';

const router = express.Router();

// All routes require authentication and creator role
router.use(authenticateToken, requireCreator);

// Project CRUD operations
router.get('/:id', getProjectForEditing);
router.post('/:id', saveProjectDraft);

// Publishing operations
router.post('/:id/publish', publishProject);
router.post('/:id/unpublish', unpublishProject);

// Media operations
router.post('/:id/media', addProjectMedia);
router.delete('/:id/media/:mediaId', deleteProjectMedia);

// Timeline operations
router.put('/:id/timeline', updateProjectTimeline);

// Technologies operations
router.put('/:id/technologies', updateProjectTechnologies);

// Outcomes operations
router.put('/:id/outcomes', updateProjectOutcomes);

export default router; 