import { Project, Media, User } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

// Save project draft
export const saveProjectDraft = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const userId = req.user.id;
    
    // Verify that the user exists in the database
    const user = await User.findByPk(userId);
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'User not found. Please log in again.' });
    }

    const { id } = req.params;
    const {
      title,
      description,
      content,
      coverImage,
      timeline,
      technologies,
      outcomes,
      mediaItems
    } = req.body;

    // Validate required fields
    if (!title || title.trim() === '') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Project title is required' });
    }

    if (!technologies || !Array.isArray(technologies) || technologies.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'At least one technology must be specified' });
    }

    if (!content || content.trim() === '') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Project content is required' });
    }

    let project;
    
    if (id === 'new') {
      // Generate slug from title
      let slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');

      // Check if slug already exists
      const existingProject = await Project.findOne({
        where: { slug }
      });

      if (existingProject) {
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }
      
      // Create new project - using native types
      project = await Project.create({
        title,
        description,
        slug,
        content,
        coverImage,
        timeline: timeline || [],
        technologies: technologies || [],
        outcomes: outcomes || [],
        userId,
        isPublished: false
      }, { transaction });
      
      // Create media items for the new project
      if (mediaItems && Array.isArray(mediaItems) && mediaItems.length > 0) {
        const mediaToCreate = mediaItems.map((item) => ({
          url: item.url.trim(),
          type: item.type,
          caption: item.caption ? item.caption.trim() : null,
          order: item.order || 0,
          projectId: project.id
        }));
        
        await Media.bulkCreate(mediaToCreate, { transaction });
      }
    } else {
      // Update existing project
      project = await Project.findOne({
        where: {
          id,
          userId
        },
        include: [
          {
            model: Media,
            as: 'mediaItems'
          }
        ]
      });
      
      if (!project) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Project not found or you do not have permission to edit it' });
      }
      
      await project.update({
        title: title || project.title,
        description: description || project.description,
        content: content !== undefined ? content : project.content,
        coverImage: coverImage !== undefined ? coverImage : project.coverImage,
        timeline: timeline !== undefined ? timeline : project.timeline,
        technologies: technologies !== undefined ? technologies : project.technologies,
        outcomes: outcomes !== undefined ? outcomes : project.outcomes
      }, { transaction });
      
      // Update media items
      if (mediaItems && Array.isArray(mediaItems)) {
        // Get existing media IDs from database
        const existingMediaIds = project.mediaItems
          .filter(m => m.id && !m.id.toString().startsWith('temp-'))
          .map(m => m.id);
        
        // Get incoming media IDs (excluding temporary IDs)
        const incomingMediaIds = mediaItems
          .filter(m => m.id && !m.id.toString().startsWith('temp-'))
          .map(m => m.id);
        
        // Delete media items that are no longer in the incoming list
        const mediaToDelete = existingMediaIds.filter(id => !incomingMediaIds.includes(id));
        if (mediaToDelete.length > 0) {
          await Media.destroy({
            where: {
              id: { [Op.in]: mediaToDelete },
              projectId: project.id
            },
            transaction
          });
        }
        
        // Create new media items and update existing ones
        for (const item of mediaItems) {
          // Skip items with temporary IDs, they'll be created as new
          if (item.id && !item.id.toString().startsWith('temp-')) {
            // Update existing media
            await Media.update({
              url: item.url.trim(),
              type: item.type,
              caption: item.caption ? item.caption.trim() : null,
              order: item.order || 0
            }, {
              where: { id: item.id, projectId: project.id },
              transaction
            });
          } else if (!item.id || item.id.toString().startsWith('temp-')) {
            // Create new media
            await Media.create({
              url: item.url.trim(),
              type: item.type,
              caption: item.caption ? item.caption.trim() : null,
              order: item.order || 0,
              projectId: project.id
            }, { transaction });
          }
        }
      }
    }
    
    // Fetch the project with media items to return in response
    const updatedProject = await Project.findOne({
      where: { id: project.id },
      include: [
        {
          model: Media,
          as: 'mediaItems',
          order: [['order', 'ASC']]
        }
      ],
      transaction
    });
    
    await transaction.commit();
    
    res.status(200).json({ 
      project: updatedProject,
      message: 'Project saved successfully'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error saving project:', error);
    res.status(500).json({ message: 'Server error saving project' });
  }
};

// Publish project
export const publishProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in again.' });
    }
    
    const project = await Project.findOne({
      where: {
        id,
        userId
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found or you do not have permission to edit it' });
    }
    
    await project.update({
      isPublished: true,
      publishedAt: new Date()
    });
    
    res.status(200).json({ 
      project,
      message: 'Project published successfully'
    });
  } catch (error) {
    console.error('Error publishing project:', error);
    res.status(500).json({ message: 'Server error publishing project' });
  }
};

// Unpublish project
export const unpublishProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in again.' });
    }
    
    const project = await Project.findOne({
      where: {
        id,
        userId
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found or you do not have permission to edit it' });
    }
    
    await project.update({
      isPublished: false
    });
    
    res.status(200).json({ 
      project,
      message: 'Project unpublished successfully'
    });
  } catch (error) {
    console.error('Error unpublishing project:', error);
    res.status(500).json({ message: 'Server error unpublishing project' });
  }
};

// Add media to project
export const addProjectMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { url, type, caption, order } = req.body;
    
    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in again.' });
    }
    
    // Validate inputs
    if (!url || !url.trim()) {
      return res.status(400).json({ message: 'Media URL is required' });
    }
    
    if (type !== 'IMAGE' && type !== 'VIDEO') {
      return res.status(400).json({ message: 'Media type must be IMAGE or VIDEO' });
    }
    
    // Verify project ownership
    const project = await Project.findOne({
      where: {
        id,
        userId
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found or you do not have permission to edit it' });
    }
    
    // Create media item
    const media = await Media.create({
      url: url.trim(),
      type,
      caption: caption ? caption.trim() : null,
      order: order || 0,
      projectId: id
    });
    
    // If this is the first media and no cover image is set, use it as cover (only for images)
    if (!project.coverImage && type === 'IMAGE') {
      await project.update({
        coverImage: url.trim()
      });
    }
    
    res.status(201).json({ 
      media,
      message: 'Media added successfully'
    });
  } catch (error) {
    console.error('Error adding media:', error);
    res.status(500).json({ message: 'Server error adding media' });
  }
};

// Delete media from project
export const deleteProjectMedia = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, mediaId } = req.params;
    
    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in again.' });
    }
    
    // Verify project ownership
    const project = await Project.findOne({
      where: {
        id,
        userId
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found or you do not have permission to edit it' });
    }
    
    // Find media item
    const media = await Media.findOne({
      where: {
        id: mediaId,
        projectId: id
      }
    });
    
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }
    
    // If this media was used as cover image, remove reference
    if (project.coverImage === media.url) {
      await project.update({
        coverImage: null
      });
    }
    
    // Delete media
    await media.destroy();
    
    res.status(200).json({ 
      message: 'Media deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ message: 'Server error deleting media' });
  }
};

// Update timeline for project
export const updateProjectTimeline = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { timeline } = req.body;
    
    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in again.' });
    }
    
    // Verify project ownership
    const project = await Project.findOne({
      where: {
        id,
        userId
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found or you do not have permission to edit it' });
    }
    
    // Update timeline with native JSONB
    await project.update({ timeline });
    
    res.status(200).json({ 
      timeline,
      message: 'Timeline updated successfully'
    });
  } catch (error) {
    console.error('Error updating timeline:', error);
    res.status(500).json({ message: 'Server error updating timeline' });
  }
};

// Update technologies for project
export const updateProjectTechnologies = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { technologies } = req.body;
    
    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in again.' });
    }
    
    // Verify project ownership
    const project = await Project.findOne({
      where: {
        id,
        userId
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found or you do not have permission to edit it' });
    }
    
    // Update technologies with native array
    await project.update({ technologies });
    
    res.status(200).json({ 
      technologies,
      message: 'Technologies updated successfully'
    });
  } catch (error) {
    console.error('Error updating technologies:', error);
    res.status(500).json({ message: 'Server error updating technologies' });
  }
};

// Update outcomes for project
export const updateProjectOutcomes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { outcomes } = req.body;
    
    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in again.' });
    }
    
    // Verify project ownership
    const project = await Project.findOne({
      where: {
        id,
        userId
      }
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found or you do not have permission to edit it' });
    }
    
    // Update outcomes with native JSONB
    await project.update({ outcomes });
    
    res.status(200).json({ 
      outcomes,
      message: 'Outcomes updated successfully'
    });
  } catch (error) {
    console.error('Error updating outcomes:', error);
    res.status(500).json({ message: 'Server error updating outcomes' });
  }
};

// Get project for editing
export const getProjectForEditing = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please log in again.' });
    }
    
    // If this is a new project, return empty template
    if (id === 'new') {
      return res.status(200).json({
        project: {
          title: '',
          description: '',
          content: '',
          timeline: [],
          technologies: [],
          outcomes: [],
          mediaItems: []
        }
      });
    }
    
    // Find project with all related data
    const project = await Project.findOne({
      where: {
        id,
        userId
      },
      include: [
        {
          model: Media,
          as: 'mediaItems',
          order: [['order', 'ASC']]
        }
      ]
    });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found or you do not have permission to edit it' });
    }
    
    res.status(200).json({ project });
  } catch (error) {
    console.error('Error fetching project for editing:', error);
    res.status(500).json({ message: 'Server error fetching project' });
  }
}; 