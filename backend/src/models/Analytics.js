import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Analytics = sequelize.define('Analytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  engagement: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  clickThroughs: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  timestamps: true
});

export default Analytics; 