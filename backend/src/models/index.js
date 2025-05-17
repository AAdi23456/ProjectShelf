import User from './User.js';
import Project from './Project.js';
import Media from './Media.js';
import Analytics from './Analytics.js';

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

export { User, Project, Media, Analytics }; 