import { User, Project } from '../models/index.js';
import { ProjectView, PortfolioVisit } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

// Record a project view
export const recordProjectView = async (req, res) => {
  try {
    const { projectId, ownerId, viewerId } = req.body;

    // Validate required fields
    if (!projectId || !ownerId) {
      return res.status(400).json({ message: 'Project ID and owner ID are required' });
    }

    // Verify that the project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Create the view record
    const view = await ProjectView.create({
      projectId,
      ownerId,
      viewerId: viewerId || null
      // createdAt is automatically set by Sequelize
    });

    res.status(201).json({ 
      success: true,
      view
    });
  } catch (error) {
    console.error('Error recording project view:', error);
    res.status(500).json({ message: 'Server error recording project view' });
  }
};

// Record a portfolio visit
export const recordPortfolioVisit = async (req, res) => {
  try {
    const { userId, viewerId } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Verify that the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the visit record
    const visit = await PortfolioVisit.create({
      userId,
      viewerId: viewerId || null
      // createdAt is automatically set by Sequelize
    });

    res.status(201).json({ 
      success: true,
      visit
    });
  } catch (error) {
    console.error('Error recording portfolio visit:', error);
    res.status(500).json({ message: 'Server error recording portfolio visit' });
  }
};

// Get project view statistics for a user
export const getProjectViewStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId, period } = req.query;
    
    let startDate = new Date();
    
    // Set the time period for statistics
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        // Default to all time (no filter)
        startDate = new Date(0); // Jan 1, 1970
    }

    const whereClause = {
      ownerId: userId,
      createdAt: {
        [Op.gte]: startDate
      }
    };

    // Filter by project if specified
    if (projectId) {
      whereClause.projectId = projectId;
    }

    // Get view statistics
    const viewStats = await ProjectView.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn('date_trunc', 'day', sequelize.col('createdAt')), 'day'],
        [sequelize.fn('count', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('date_trunc', 'day', sequelize.col('createdAt'))],
      order: [[sequelize.fn('date_trunc', 'day', sequelize.col('createdAt')), 'ASC']]
    });

    // Get total views
    const totalViews = await ProjectView.count({
      where: whereClause
    });

    // Get unique viewers
    const uniqueViewers = await ProjectView.count({
      where: whereClause,
      distinct: true,
      col: 'viewerId'
    });

    // Get project breakdown (if not filtering by a specific project)
    let projectBreakdown = [];
    if (!projectId) {
      projectBreakdown = await ProjectView.findAll({
        where: {
          ownerId: userId,
          createdAt: {
            [Op.gte]: startDate
          }
        },
        include: [
          {
            model: Project,
            attributes: ['id', 'title'],
            required: true
          }
        ],
        attributes: [
          'projectId',
          [sequelize.fn('count', sequelize.col('ProjectView.id')), 'count']
        ],
        group: ['projectId', 'Project.id', 'Project.title'],
        order: [[sequelize.fn('count', sequelize.col('ProjectView.id')), 'DESC']]
      });
    }

    res.status(200).json({
      totalViews,
      uniqueViewers,
      dailyViews: viewStats,
      projectBreakdown
    });
  } catch (error) {
    console.error('Error getting project view stats:', error);
    res.status(500).json({ message: 'Server error getting project view statistics' });
  }
};

// Get portfolio visit statistics for a user
export const getPortfolioVisitStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period } = req.query;
    
    let startDate = new Date();
    
    // Set the time period for statistics
    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        // Default to all time (no filter)
        startDate = new Date(0); // Jan 1, 1970
    }

    const whereClause = {
      userId: userId,
      createdAt: {
        [Op.gte]: startDate
      }
    };

    // Get visit statistics
    const visitStats = await PortfolioVisit.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn('date_trunc', 'day', sequelize.col('createdAt')), 'day'],
        [sequelize.fn('count', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('date_trunc', 'day', sequelize.col('createdAt'))],
      order: [[sequelize.fn('date_trunc', 'day', sequelize.col('createdAt')), 'ASC']]
    });

    // Get total visits
    const totalVisits = await PortfolioVisit.count({
      where: whereClause
    });

    // Get unique visitors
    const uniqueVisitors = await PortfolioVisit.count({
      where: whereClause,
      distinct: true,
      col: 'viewerId'
    });

    res.status(200).json({
      totalVisits,
      uniqueVisitors,
      dailyVisits: visitStats
    });
  } catch (error) {
    console.error('Error getting portfolio visit stats:', error);
    res.status(500).json({ message: 'Server error getting portfolio visit statistics' });
  }
}; 