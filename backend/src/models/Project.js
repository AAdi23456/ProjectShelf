import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  overview: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  coverImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  timeline: {
    type: DataTypes.JSONB, // Using JSONB for PostgreSQL
    allowNull: true,
    defaultValue: []
  },
  technologies: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Using PostgreSQL ARRAY
    allowNull: true,
    defaultValue: []
  },
  outcomes: {
    type: DataTypes.JSONB, // Using JSONB for PostgreSQL
    allowNull: true,
    defaultValue: []
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  timestamps: true,
  hooks: {
    // Add hooks to handle serialization/deserialization automatically
    afterFind: (result) => {
      if (!result) return result;
      
      // Handle array results
      if (Array.isArray(result)) {
        result.forEach(instance => {
          parseJsonFields(instance);
        });
      } 
      // Handle single instance
      else {
        parseJsonFields(result);
      }
      
      return result;
    }
  }
});

// Helper function to parse JSON fields
function parseJsonFields(instance) {
  if (!instance || typeof instance.dataValues !== 'object') return;
  
  // Parse JSON strings to objects
  ['timeline', 'technologies', 'outcomes'].forEach(field => {
    if (instance.dataValues[field] && typeof instance.dataValues[field] === 'string') {
      try {
        instance.dataValues[field] = JSON.parse(instance.dataValues[field]);
      } catch (error) {
        instance.dataValues[field] = [];
        console.error(`Error parsing ${field} for project ${instance.id}:`, error);
      }
    }
  });
}

export default Project; 