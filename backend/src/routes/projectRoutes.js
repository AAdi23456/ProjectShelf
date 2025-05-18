import express from 'express';
import { User, Project, Media, Analytics } from '../models/index.js';
import { authenticateToken, requireCreator, isResourceOwner } from '../middleware/auth.js';
import { Op } from 'sequelize';

const router = express.Router();

// Get all projects (with pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: projects } = await Project.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'username', 'avatarUrl']
        },
        {
          model: Media,
          as: 'mediaItems',
          limit: 1
        }
      ]
    });

    res.status(200).json({
      projects,
      pagination: {
        total: count,
        page,
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error fetching projects' });
  }
});

// Get project by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const project = await Project.findOne({
      where: { slug },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'username', 'avatarUrl', 'bio']
        },
        {
          model: Media,
          as: 'mediaItems',
          order: [['order', 'ASC']]
        }
      ]
    });

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Check if current user is the creator of this project
    const userId = req.user?.id;
    const isCreator = userId && userId === project.userId;

    // Only track views if the viewer is not the creator
    if (!isCreator) {
      try {
        // Increment view count in analytics
        const today = new Date().toISOString().split('T')[0];
        
        // Find analytics record for today or create a new one
        const [analytics] = await Analytics.findOrCreate({
          where: { 
            projectId: project.id, 
            date: {
              [Op.gte]: new Date(today),
              [Op.lt]: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000)
            }
          },
          defaults: {
            projectId: project.id,
            userId: project.userId,
            views: 1,
            date: new Date()
          }
        });
        
        if (analytics) {
          // Only increment if it's an existing record (not newly created)
          if (!analytics.isNewRecord) {
            await analytics.increment('views');
          }
        }
        
        console.log(`View tracked for project ${project.id}`);
      } catch (error) {
        console.error('Error tracking view:', error);
        // Continue even if tracking fails
      }
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error fetching project' });
  }
});

// Create new project (only for creators)
router.post('/', authenticateToken, requireCreator, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    const { title, description, overview, tools, outcomes } = req.body;

    // Generate slug from title
    let slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');

    // Check if slug already exists
    const existingProject = await Project.findOne({
      where: { slug }
    });

    if (existingProject) {
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    const project = await Project.create({
      title,
      description,
      slug,
      overview,
      tools,
      outcomes,
      userId
    });

    res.status(201).json({ project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error creating project' });
  }
});

// Update project (only for project owner)
router.put('/:id', authenticateToken, isResourceOwner, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, overview, tools, outcomes } = req.body;

    const project = await Project.findByPk(id);
    
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    
    project.title = title || project.title;
    project.description = description || project.description;
    project.overview = overview || project.overview;
    project.tools = tools || project.tools;
    project.outcomes = outcomes || project.outcomes;
    
    await project.save();

    res.status(200).json({ project });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error updating project' });
  }
});

// Delete project (only for project owner)
router.delete('/:id', authenticateToken, isResourceOwner, async (req, res) => {
  try {
    const { id } = req.params;

    // Delete associated media items first
    await Media.destroy({
      where: { projectId: id }
    });

    // Delete analytics data
    await Analytics.destroy({
      where: { projectId: id }
    });

    // Delete the project
    await Project.destroy({
      where: { id }
    });

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error deleting project' });
  }
});

// Get projects by current user
router.get('/user/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const projects = await Project.findAll({
      where: { userId },
      include: [
        {
          model: Media,
          as: 'mediaItems',
          limit: 1
        },
        {
          model: Analytics,
          as: 'analytics',
          limit: 7,
          order: [['date', 'DESC']]
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    res.status(200).json({ projects });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ message: 'Server error fetching user projects' });
  }
});

export default router; 