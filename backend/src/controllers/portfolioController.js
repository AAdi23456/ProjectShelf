import { User, Project, Media, Analytics } from '../models/index.js';
import { Op } from 'sequelize';

// Get user portfolio by username
export const getUserPortfolio = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({
      where: { username },
      attributes: ['id', 'username', 'name', 'bio', 'avatarUrl', 'role', 'createdAt'],
      include: [{
        model: Project,
        as: 'projects',
        include: [{
          model: Media,
          as: 'mediaItems'
        }]
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Track view for analytics if not the owner viewing
    if (req.user && req.user.id !== user.id) {
      try {
        await Analytics.create({
          userId: user.id,
          visitorId: req.user?.id || null,
          action: 'PORTFOLIO_VIEW',
          metadata: JSON.stringify({
            timestamp: new Date(),
            referrer: req.headers.referer || 'direct'
          })
        });
      } catch (analyticsError) {
        console.error('Error recording analytics:', analyticsError);
        // Continue execution even if analytics fails
      }
    }

    res.status(200).json({ 
      portfolio: user
    });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    res.status(500).json({ message: 'Server error fetching portfolio' });
  }
};

// Get project details by username and project id
export const getUserProject = async (req, res) => {
  try {
    const { username, projectId } = req.params;
    console.log(`Fetching project for user ${username}, project ID: ${projectId}`);

    const user = await User.findOne({
      where: { username },
      attributes: ['id', 'username', 'name']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const project = await Project.findOne({
      where: { 
        id: projectId,
        userId: user.id
      },
      include: [{
        model: Media,
        as: 'mediaItems',
        order: [['order', 'ASC']]
      }]
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Track project view for analytics if not the owner viewing
    if (req.user && req.user.id !== user.id) {
      try {
        await Analytics.create({
          userId: user.id,
          projectId: project.id,
          visitorId: req.user?.id || null,
          action: 'PROJECT_VIEW',
          metadata: JSON.stringify({
            timestamp: new Date(),
            referrer: req.headers.referer || 'direct'
          })
        });
      } catch (analyticsError) {
        console.error('Error recording analytics:', analyticsError);
        // Continue execution even if analytics fails
      }
    }

    // Make sure we're returning a complete project object including all fields
    const projectData = {
      ...project.toJSON(),
      user: {
        username: user.username,
        name: user.name
      }
    };

    console.log(`Successfully fetched project ${projectData.id} for ${username}`);
    res.status(200).json({ project: projectData });
  } catch (error) {
    console.error('Project fetch error:', error);
    res.status(500).json({ message: 'Server error fetching project' });
  }
}; 