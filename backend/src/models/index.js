import User from './User.js';
import Project from './Project.js';
import Media from './Media.js';
import Analytics from './Analytics.js';
import ProjectView from './ProjectView.js';
import PortfolioVisit from './PortfolioVisit.js';

// User to Project relationship
User.hasMany(Project, { foreignKey: 'userId', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Project to Media relationship
Project.hasMany(Media, { foreignKey: 'projectId', as: 'mediaItems' });
Media.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// Project to Analytics relationship
Project.hasMany(Analytics, { foreignKey: 'projectId', as: 'analytics' });
Analytics.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// User to Analytics relationship
User.hasMany(Analytics, { foreignKey: 'userId', as: 'analytics' });
Analytics.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Project to ProjectView relationship
Project.hasMany(ProjectView, { foreignKey: 'projectId', as: 'projectViews' });
ProjectView.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// User to ProjectView relationships (as owner and viewer)
User.hasMany(ProjectView, { foreignKey: 'ownerId', as: 'receivedProjectViews' });
ProjectView.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
User.hasMany(ProjectView, { foreignKey: 'viewerId', as: 'viewedProjects' });
ProjectView.belongsTo(User, { foreignKey: 'viewerId', as: 'viewer' });

// User to PortfolioVisit relationships (as portfolio owner and visitor)
User.hasMany(PortfolioVisit, { foreignKey: 'userId', as: 'portfolioVisits' });
PortfolioVisit.belongsTo(User, { foreignKey: 'userId', as: 'portfolioOwner' });
User.hasMany(PortfolioVisit, { foreignKey: 'viewerId', as: 'visitedPortfolios' });
PortfolioVisit.belongsTo(User, { foreignKey: 'viewerId', as: 'visitor' });

export { User, Project, Media, Analytics, ProjectView, PortfolioVisit }; 