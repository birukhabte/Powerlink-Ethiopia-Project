const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Get all users (for admin)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        email, 
        username, 
        first_name, 
        last_name, 
        role,
        is_active, 
        email_verified, 
        created_at, 
        updated_at
      FROM users 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      users: result.rows
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        id, 
        email, 
        username, 
        first_name, 
        last_name, 
        role,
        is_active, 
        email_verified, 
        created_at, 
        updated_at
      FROM users 
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

// Update user (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, username, first_name, last_name, is_active, email_verified } = req.body;

    const result = await pool.query(`
      UPDATE users 
      SET 
        email = COALESCE($1, email),
        username = COALESCE($2, username),
        first_name = COALESCE($3, first_name),
        last_name = COALESCE($4, last_name),
        is_active = COALESCE($5, is_active),
        email_verified = COALESCE($6, email_verified),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING id, email, username, first_name, last_name, is_active, email_verified, created_at, updated_at
    `, [email, username, first_name, last_name, is_active, email_verified, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

// Delete user (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
});

// Update user role (admin only)
router.patch('/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ['customer', 'special', 'technician', 'supervisor', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role specified'
      });
    }

    const result = await pool.query(`
      UPDATE users 
      SET 
        role = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, email, username, first_name, last_name, is_active, email_verified, role, created_at, updated_at
    `, [role, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user role'
    });
  }
});

// Toggle user status (admin only)
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      UPDATE users 
      SET 
        is_active = NOT is_active,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, email, username, first_name, last_name, is_active, email_verified, created_at, updated_at
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User status updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user status'
    });
  }
});

module.exports = router;