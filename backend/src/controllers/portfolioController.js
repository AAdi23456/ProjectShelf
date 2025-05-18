import { User, Project, Media, ProjectView, PortfolioVisit, Analytics } from '../models/index.js';
import { Op } from 'sequelize';

// Get a user's portfolio by username
export const getUserPortfolio = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Check if the parameter contains @ symbol (likely an email)
    const isEmail = username.includes('@');
    
    // Search by email or username based on the parameter format
    const user = await User.findOne({ 
      where: isEmail ? { email: username } : { username },
      attributes: ['id', 'username', 'name', 'bio', 'avatarUrl'] 
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const projects = await Project.findAll({
      where: { 
        userId: user.id,
        isPublished: true
      },
      attributes: ['id', 'title', 'description', 'coverImage', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Media,
          as: 'mediaItems'
        }
      ]
    });
    
    // Track portfolio visit if not the user viewing their own portfolio
    if (req.user && req.user.id !== user.id) {
      await PortfolioVisit.create({
        userId: user.id,
        viewerId: req.user.id
      });
    } else if (!req.user) {
      // Anonymous visit
      await PortfolioVisit.create({
        userId: user.id,
        viewerId: null
      });
    }
    
    // Ensure all project fields have values to prevent frontend errors
    const safeProjects = projects.map(project => {
      const projectData = project.toJSON();
      return {
        ...projectData,
        description: projectData.description || '',
        coverImage: projectData.coverImage || null,
        mediaItems: projectData.mediaItems || []
      };
    });
    
    res.json({
      user,
      projects: safeProjects
    });
  } catch (error) {
    console.error('Error getting user portfolio:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific project from a user's portfolio
export const getUserProject = async (req, res) => {
  try {
    const { username, projectId } = req.params;
    
    // Check if the parameter contains @ symbol (likely an email)
    const isEmail = username.includes('@');
    
    // Search by email or username based on the parameter format
    const user = await User.findOne({ 
      where: isEmail ? { email: username } : { username },
      attributes: ['id', 'username', 'name', 'bio', 'avatarUrl'] 
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if the requesting user is the owner of the portfolio
    const isOwner = req.user && req.user.id === user.id;
    
    // Use different query conditions based on ownership
    const projectQuery = {
      where: { 
        id: projectId,
        userId: user.id,
        // Only apply isPublished filter for non-owners
        ...(isOwner ? {} : { isPublished: true })
      },
      include: [
        {
          model: Media,
          as: 'mediaItems'
        }
      ]
    };
    
    const project = await Project.findOne(projectQuery);
    
    if (!project) {
      return res.status(404).json({ 
        message: isOwner ? 
          'Project not found' : 
          'Project not found or not published'
      });
    }
    
    // Only track the view if the viewer is not the owner
    if (!isOwner) {
      try {
        // 1. Track individual view in ProjectView table
        await ProjectView.create({
          projectId: project.id,
          ownerId: user.id,
          viewerId: req.user ? req.user.id : null
        });
        
        // 2. Update analytics for aggregate view count
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
        
        if (analytics && !analytics.isNewRecord) {
          await analytics.increment('views');
        }
        
        console.log('Project view tracked successfully');
      } catch (trackError) {
        console.error('Error tracking project view:', trackError);
        // Continue even if tracking fails
      }
    }
    
    res.json({ project });
  } catch (error) {
    console.error('Error getting user project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get published portfolios
export const getPublishedPortfolios = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    
    // First, find users who have published projects
    const usersWithProjects = await User.findAll({
      attributes: ['id', 'username', 'name', 'bio', 'avatarUrl'],
      include: [
        {
          model: Project,
          as: 'projects',
          where: { isPublished: true },
          required: true,
          attributes: ['id'], // Just get IDs for counting
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    // Sort and paginate the results manually
    const totalCount = usersWithProjects.length;
    const paginatedUsers = usersWithProjects
      .slice(offset, offset + limit)
      .map(user => {
        const userData = user.toJSON();
        return {
          ...userData,
          projectCount: userData.projects.length,
          projects: undefined // Remove the projects array
        };
      });
    
    res.status(200).json({
      users: paginatedUsers,
      pagination: {
        total: totalCount,
        page,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error getting published portfolios:', error);
    res.status(500).json({ message: 'Server error getting published portfolios' });
  }
}; 