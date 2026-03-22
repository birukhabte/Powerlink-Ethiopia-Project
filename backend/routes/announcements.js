const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Get all active announcements (for home page)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        title, 
        content, 
        type, 
        priority,
        created_at,
        expires_at
      FROM announcement1 
      WHERE is_active = true 
        AND (expires_at IS NULL OR expires_at > NOW())
      ORDER BY priority DESC, created_at DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      announcement1: result.rows
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch announcements' 
    });
  }
});

// Get all announcements (for admin)
router.get('/admin', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.id, 
        a.title, 
        a.content, 
        a.type, 
        a.priority,
        a.is_active,
        a.created_at,
        a.updated_at,
        a.expires_at,
        u.username as created_by_username
      FROM announcement1 a
      LEFT JOIN users u ON a.created_by = u.id
      ORDER BY a.created_at DESC
    `);

    res.json({
      success: true,
      announcement1: result.rows
    });
  } catch (error) {
    console.error('Error fetching all announcements:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch announcements' 
    });
  }
});

// Create new announcement (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, content, type = 'info', priority = 1, expires_at, created_by } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title and content are required' 
      });
    }

    const result = await pool.query(`
      INSERT INTO announcement1 (title, content, type, priority, expires_at, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, content, type, priority, expires_at || null, created_by || null]);

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      announcement: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create announcement' 
    });
  }
});

// Update announcement (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, priority, is_active, expires_at } = req.body;

    const result = await pool.query(`
      UPDATE announcement1 
      SET 
        title = COALESCE($1, title),
        content = COALESCE($2, content),
        type = COALESCE($3, type),
        priority = COALESCE($4, priority),
        is_active = COALESCE($5, is_active),
        expires_at = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [title, content, type, priority, is_active, expires_at, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Announcement not found' 
      });
    }

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      announcement: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update announcement' 
    });
  }
});

// Delete announcement (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM announcement1 WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Announcement not found' 
      });
    }

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete announcement' 
    });
  }
});

// Toggle announcement status (admin only)
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      UPDATE announcement1 
      SET 
        is_active = NOT is_active,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Announcement not found' 
      });
    }

    res.json({
      success: true,
      message: 'Announcement status updated successfully',
      announcement: result.rows[0]
    });
  } catch (error) {
    console.error('Error toggling announcement status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update announcement status' 
    });
  }
});

module.exports = router;