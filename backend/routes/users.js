const express = require('express');
const pool = require('../config/database');

const router = express.Router();

/**
 * ======================================
 * GET ALL USERS (ADMIN)
 * ======================================
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, email, username,
        first_name, last_name,
        role, is_active,
        email_verified,
        created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      users: result.rows
    });
  } catch (error) {
    console.error('FETCH USERS ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

/**
 * ======================================
 * GET SINGLE USER
 * ======================================
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        id, email, username,
        first_name, last_name,
        role, is_active,
        email_verified,
        created_at, updated_at
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
    console.error('FETCH USER ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
});

/**
 * ======================================
 * UPDATE USER ROLE (FIXED FOR YOUR FRONTEND)
 * ======================================
 * Frontend calls:
 * PATCH /api/users/update-role/:id
 */
router.patch('/update-role/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    console.log("ROLE UPDATE REQUEST:", { id, role });

    // Validate role
    const validRoles = [
      'customer',
      'special',
      'technician',
      'supervisor',
      'admin'
    ];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role'
      });
    }

    // Update role
    const result = await pool.query(`
      UPDATE users
      SET role = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, email, username, role
    `, [role, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Role updated successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('ROLE UPDATE ERROR:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to update role'
    });
  }
});

/**
 * ======================================
 * UPDATE USER INFO (OPTIONAL)
 * ======================================
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email,
      username,
      first_name,
      last_name,
      is_active,
      email_verified
    } = req.body;

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
      RETURNING *
    `, [
      email,
      username,
      first_name,
      last_name,
      is_active,
      email_verified,
      id
    ]);

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
    console.error('UPDATE USER ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

/**
 * ======================================
 * DELETE USER
 * ======================================
 */
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
    console.error('DELETE USER ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
});

/**
 * ======================================
 * TOGGLE USER STATUS
 * ======================================
 */
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      UPDATE users
      SET is_active = NOT is_active,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, is_active
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User status updated',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('TOGGLE USER ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update status'
    });
  }
});

module.exports = router;
