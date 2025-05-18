import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Project, Media } from '../models/index.js';
import { authenticateToken, requireCreator } from '../middleware/auth.js';
import { Op } from 'sequelize';

const router = express.Router();

// Helper function to generate JWT
const generateToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
  const token = jwt.sign(
    { id: user.id, role: user.role },
    jwtSecret,
    { expiresIn: '24h' }
  );
  return token;
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, name } = req.body;
    console.log(`Registration attempt for email: ${email}, username: ${username}`);

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      console.log(`Registration failed: User with email ${email} or username ${username} already exists`);
      res.status(400).json({ 
        message: 'User with this email or username already exists' 
      });
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user (always as CREATOR)
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      name,
      role: 'CREATOR' // All users are creators by default
    });

    // Generate JWT token
    const token = generateToken(user);

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    console.log(`Registration successful for user: ${email}, ID: ${user.id}`);
    res.status(201).json({ 
      user: userResponse,
      token 
    });
  } catch (error) {
    console.error('Registration error details:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);

    // Find user by email
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      console.log(`Login failed: User with email ${email} not found`);
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`Password validation result: ${isPasswordValid}`);
    
    if (!isPasswordValid) {
      console.log(`Login failed: Invalid password for user ${email}`);
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = generateToken(user);

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    console.log(`Login successful for user: ${email}`);
    res.status(200).json({ 
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error details:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({ user: userResponse });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error fetching current user' });
  }
});

// Get user profile (public)
router.get('/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({
      where: { username },
      include: [{
        model: Project,
        as: 'projects',
        include: [{
          model: Media,
          as: 'mediaItems'
        }]
      }]
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({ user: userResponse });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// Update user profile (protected)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    const { name, bio, avatarUrl } = req.body;

    // Find user and update
    const user = await User.findByPk(userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    user.name = name || user.name;
    user.bio = bio !== undefined ? bio : user.bio;
    user.avatarUrl = avatarUrl !== undefined ? avatarUrl : user.avatarUrl;
    
    await user.save();

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({ user: userResponse });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Upgrade user to creator (for demo, in a real app this might involve a payment process)
router.post('/upgrade-to-creator', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    user.role = 'CREATOR';
    await user.save();

    // Generate new token with updated role
    const token = generateToken(user);

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({ 
      user: userResponse,
      token,
      message: 'Successfully upgraded to creator account'
    });
  } catch (error) {
    console.error('Role upgrade error:', error);
    res.status(500).json({ message: 'Server error upgrading role' });
  }
});

export default router; 