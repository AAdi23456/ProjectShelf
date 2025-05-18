import { User, Project, Media } from '../models/index.js';
import Analytics from '../models/Analytics.js';

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
    
    // Track view if not the user viewing their own portfolio
    if (req.user && req.user.id !== user.id) {
      await Analytics.create({
        views: 1,
        userId: user.id
      });
    } else if (!req.user) {
      // Anonymous view
      await Analytics.create({
        views: 1,
        userId: user.id
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
    
    // Track engagement if not the user viewing their own project
    if (req.user && req.user.id !== user.id) {
      await Analytics.create({
        engagement: 1,
        clickThroughs: 1,
        projectId: project.id,
        userId: user.id
      });
    } else if (!req.user) {
      // Anonymous engagement
      await Analytics.create({
        engagement: 1,
        clickThroughs: 1,
        projectId: project.id,
        userId: user.id
      });
    }
    
    // Prepare safe project data with default values for null fields
    const safeProject = {
      ...project.toJSON(),
      title: project.title || '',
      description: project.description || '',
      content: project.content || '',
      coverImage: project.coverImage || null,
      timeline: project.timeline || [],
      technologies: project.technologies || [],
      outcomes: project.outcomes || [],
      mediaItems: project.mediaItems || []
    };
    
    res.json({ user, project: safeProject });
  } catch (error) {
    console.error('Error getting user project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all published portfolios
export const getPublishedPortfolios = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'name', 'bio', 'avatarUrl'],
      include: [
        {
          model: Project,
          as: 'projects',
          attributes: ['id'],
          where: { isPublished: true },
          required: true
        }
      ]
    });

    // Transform data for frontend display with safe default values
    const portfolios = await Promise.all(users.map(async (user) => {
      const projectCount = await Project.count({
        where: { 
          userId: user.id,
          isPublished: true
        }
      });

      return {
        id: user.id,
        username: user.username,
        displayName: user.name || user.username,
        bio: user.bio || '',
        profileImage: user.avatarUrl || null,
        projectCount
      };
    }));

    res.json(portfolios);
  } catch (error) {
    console.error('Error getting published portfolios:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 