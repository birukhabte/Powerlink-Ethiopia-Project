/**
 * Admin Routes
 * Provides system-wide analytics and admin-only operations.
 */
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

/**
 * GET /api/admin/stats
 * System-wide statistics for admin dashboard
 */
router.get('/stats', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [
      usersResult,
      requestsResult,
      outagesResult,
      techsResult,
    ] = await Promise.all([
      pool.query('SELECT role, COUNT(*) as count FROM users GROUP BY role'),
      pool.query('SELECT status, COUNT(*) as count FROM service_requests GROUP BY status'),
      pool.query('SELECT status, COUNT(*) as count FROM outage_reports GROUP BY status'),
      pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'technician' AND is_active = true"),
    ]);

    // Build user stats
    const userStats = {};
    usersResult.rows.forEach(row => { userStats[row.role] = parseInt(row.count); });

    // Build request stats
    const requestStats = {};
    requestsResult.rows.forEach(row => { requestStats[row.status] = parseInt(row.count); });

    // Build outage stats
    const outageStats = {};
    outagesResult.rows.forEach(row => { outageStats[row.status] = parseInt(row.count); });

    // Recent activity (last 7 days)
    const recentActivity = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as requests
      FROM service_requests
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    const totalUsers = usersResult.rows.reduce((sum, r) => sum + parseInt(r.count), 0);
    const totalRequests = requestsResult.rows.reduce((sum, r) => sum + parseInt(r.count), 0);
    const pendingRequests = (requestStats['pending'] || 0) + (requestStats['under_review'] || 0);
    const completedRequests = requestStats['completed'] || 0;

    res.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalRequests,
          pendingRequests,
          completedRequests,
          activeTechnicians: parseInt(techsResult.rows[0]?.count || 0),
          totalOutages: outagesResult.rows.reduce((sum, r) => sum + parseInt(r.count), 0),
        },
        userBreakdown: userStats,
        requestBreakdown: requestStats,
        outageBreakdown: outageStats,
        recentActivity: recentActivity.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
});

/**
 * GET /api/admin/users
 * All users with full info (admin only)
 */
router.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, email, username, first_name, last_name, role, phone,
             is_active, email_verified, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `);
    res.json({ success: true, users: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
});

/**
 * GET /api/admin/technicians
 * List of technicians (for assignment dropdowns)
 */
router.get('/technicians', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, first_name, last_name, username, email, phone, is_active
      FROM users
      WHERE role = 'technician'
      ORDER BY first_name ASC
    `);
    res.json({ success: true, technicians: result.rows });
  } catch (error) {
    console.error('Error fetching technicians:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch technicians' });
  }
});

/**
 * POST /api/admin/register-staff
 * Register a new technician or supervisor (Admin only)
 */
router.post('/register-staff', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { 
      email, 
      username, 
      password, 
      firstName, 
      lastName, 
      role, 
      phone,
      department,
      position 
    } = req.body;

    // Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await pool.query(`
      INSERT INTO users (
        email, username, password_hash, first_name, last_name, role, phone, address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING id, email, username, first_name, last_name, role
    `, [
      email, 
      username, 
      passwordHash, 
      firstName, 
      lastName, 
      role, 
      phone || null,
      department ? `${department} - ${position}` : null
    ]);

    res.status(201).json({
      success: true,
      message: 'Staff member registered successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Staff registration error:', error);
    res.status(500).json({ success: false, error: 'Server error during staff registration' });
  }
});

module.exports = router;
