import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import sequelize from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import projectBuilderRoutes from './routes/projectBuilderRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { User, Project, Media } from './models/index.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Enhanced CORS configuration
app.use(cors({
  origin: 'https://project-shelf-hqb4.vercel.app', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true // Allow cookies
}));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'ProjectShelf API is running' });
});

// Debug endpoint to directly check database contents (for development only)
app.get('/debug', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'name']
    });
    
    const projects = await Project.findAll({
      attributes: ['id', 'title', 'isPublished', 'userId']
    });
    
    res.json({
      users,
      projects
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Import routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/builder', projectBuilderRoutes); // New project builder routes
app.use('/api/analytics', analyticsRoutes); // Analytics routes
app.use('/portfolios', portfolioRoutes); // Username-based routes (note: no /api prefix for cleaner URLs)

// Function to seed database with sample data if none exists
const seedDatabase = async () => {
  try {
    // Check if any users exist
    const userCount = await User.count();
    let userId;
    
    if (userCount === 0) {
      console.log('No users found, creating sample user...');
      
      // Create a sample user
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await User.create({
        email: 'root@example.com',
        password: hashedPassword,
        username: 'root',
        name: 'walk in morning',
        bio: 'Sample portfolio for development',
        role: 'CREATOR'
      });
      
      userId = user.id;
      console.log('Sample user created successfully!');
    } else {
      // Get the existing user ID
      const existingUser = await User.findOne({ where: { username: 'root' }});
      userId = existingUser ? existingUser.id : null;
      console.log('Using existing user with ID:', userId);
    }
    
    // Only proceed if we have a valid userId
    if (userId) {
      // Check if user has any projects
      const projectCount = await Project.count({ where: { userId } });
      
      if (projectCount === 0) {
        console.log('No projects found for user, creating sample project...');
        
        // Create a sample project
        const project = await Project.create({
          title: 'Sample Project',
          description: 'This is a sample project for development purposes.',
          slug: 'sample-project',
          content: 'Detailed content about this sample project.',
          overview: 'A brief overview of the sample project.',
          isPublished: true,
          userId: userId
        });
        
        // Create a sample media item
        await Media.create({
          url: 'https://placehold.co/600x400/009688/ffffff?text=Sample+Project',
          type: 'IMAGE',
          caption: 'Sample project thumbnail',
          projectId: project.id
        });
        
        console.log('Sample project created successfully!');
      } else {
        console.log(`User already has ${projectCount} projects`);
      }
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Sync database and start server
sequelize.sync({ force: false }) // Changed to false to preserve data between restarts
  .then(async () => {
    console.log('Database synced');
    
    // Seed database with sample data if needed
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  }); 