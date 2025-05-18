import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const PortfolioVisit = sequelize.define('PortfolioVisit', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'userId'
  },
  viewerId: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [] // Remove indexes to avoid errors
});

export default PortfolioVisit; 