import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ProjectView = sequelize.define('ProjectView', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  viewerId: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [] // Remove indexes to avoid errors
});

export default ProjectView; 