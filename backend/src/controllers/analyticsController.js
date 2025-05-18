import { User, Project, Analytics } from '../models/index.js';

// Track portfolio or project view
export const trackView = async (req, res) => {
  try {
    const { username, projectId, type } = req.body;
    
    // Find the user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create analytics record based on type
    if (type === 'portfolio') {
      await Analytics.create({
        views: 1,
        userId: user.id
      });
    } else if (type === 'project' && projectId) {
      // Find the project
      const project = await Project.findOne({ 
        where: { 
          id: projectId,
          userId: user.id,
          isPublished: true
        }
      });
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found or not published' });
      }
      
      await Analytics.create({
        views: 1,
        userId: user.id,
        projectId: project.id
      });
    } else {
      return res.status(400).json({ message: 'Invalid tracking type or missing projectId' });
    }
    
    res.status(200).json({ message: 'View tracked successfully' });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Track engagement metrics
export const trackEngagement = async (req, res) => {
  try {
    const { username, projectId, engagementType } = req.body;
    
    // Find the user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find the project
    const project = await Project.findOne({ 
      where: { 
        id: projectId,
        userId: user.id,
        isPublished: true
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found or not published' });
    }
    
    // Create analytics record based on engagement type
    const analyticsData = {
      userId: user.id,
      projectId: project.id
    };
    
    if (engagementType === 'clickThrough') {
      analyticsData.clickThroughs = 1;
    } else if (engagementType === 'engagement') {
      analyticsData.engagement = 1;
    } else {
      // Default to general engagement
      analyticsData.engagement = 1;
    }
    
    await Analytics.create(analyticsData);
    
    res.status(200).json({ message: 'Engagement tracked successfully' });
  } catch (error) {
    console.error('Error tracking engagement:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 