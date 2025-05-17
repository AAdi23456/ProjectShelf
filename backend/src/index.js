import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import projectBuilderRoutes from './routes/projectBuilderRoutes.js';
import './models/index.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Enhanced CORS configuration
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true // Allow cookies
}));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'ProjectShelf API is running' });
});

// Import routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/builder', projectBuilderRoutes); // New project builder routes
app.use('/portfolios', portfolioRoutes); // Username-based routes (note: no /api prefix for cleaner URLs)

// Sync database and start server
const isDevelopment = process.env.NODE_ENV !== 'production';

sequelize.sync({ force: isDevelopment }) // Only force sync in development
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  }); 