const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

/**
 * @route   GET /api/dashboard/technician
 * @desc    Get technician dashboard data (stats and assigned tasks)
 * @access  Private (Technician only)
 */
router.get('/technician', authenticateToken, authorizeRoles('technician'), async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Fetch both service requests and outage reports assigned to this technician
    const [serviceTasksResult, outageTasksResult] = await Promise.all([
      pool.query(`
        SELECT 'service_request' as type, * FROM service_requests 
        WHERE assigned_to = $1 
        ORDER BY created_at DESC
      `, [userId]),
      pool.query(`
        SELECT 'outage_report' as type, * FROM outage_reports 
        WHERE assigned_to = $1 
        ORDER BY created_at DESC
      `, [userId])
    ]);

    const allTasks = [...serviceTasksResult.rows, ...outageTasksResult.rows];

    // Fetch schedule (upcoming tasks)
    const scheduleResult = await pool.query(`
      SELECT 'service_request' as type, sr.id, sr.ticket_id, sr.scheduled_date,
             sr.city, sr.woreda, sr.service_type
      FROM service_requests sr
      WHERE assigned_to = $1 AND scheduled_date >= NOW()
      UNION
      SELECT 'outage_report' as type, o.id, ('OUT-' || o.id)::text as ticket_id, o.scheduled_date,
             null as city, null as woreda, o.outage_type as service_type
      FROM outage_reports o
      WHERE assigned_to = $1 AND scheduled_date >= NOW()
      ORDER BY scheduled_date ASC LIMIT 5
    `, [userId]);

    // Calculate stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const assigned = allTasks.filter(t => t.status === 'assigned' || t.status === 'pending').length;
    const in_progress = allTasks.filter(t => ['in_progress', 'traveling', 'assessment', 'waiting_parts'].includes(t.status)).length;
    const completed_today = allTasks.filter(t =>
      (t.status === 'completed' || t.status === 'resolved') &&
      new Date(t.updated_at) >= today &&
      new Date(t.updated_at) < tomorrow
    ).length;
    const upcoming = scheduleResult.rows.length;

    res.json({
      success: true,
      data: {
        stats: {
          assigned,
          in_progress,
          completed_today
        },
        assignedTasks: allTasks.slice(0, 5).map(t => ({
          id: t.ticket_id || `OUT-${t.id}`,
          db_id: t.id,
          type: t.type,
          location: t.type === 'service_request' ? 
            `${t.city || ''}, ${t.woreda || ''}` : 
            t.address || 'Location not specified',
          task_type: t.type === 'service_request' ? t.service_type : t.outage_type,
          status: t.status,
          priority: t.priority || t.urgency,
          created_at: t.created_at
        })),
        schedule: scheduleResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching technician dashboard:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/dashboard/supervisor
 * @desc    Get supervisor dashboard data (metrics and pending requests)
 * @access  Private (Supervisor only)
 */
router.get('/supervisor', authenticateToken, authorizeRoles('supervisor', 'admin'), async (req, res) => {
  try {
    const [requestsResult, outagesResult, approvedResult, assignedResult, inProgressResult, completedResult, techsResult] = await Promise.all([
      pool.query("SELECT * FROM service_requests WHERE status IN ('pending', 'under_review') ORDER BY created_at ASC LIMIT 5"),
      pool.query("SELECT * FROM outage_reports WHERE status = 'pending' ORDER BY created_at ASC LIMIT 5"),
      pool.query("SELECT COUNT(*) FROM service_requests WHERE status = 'approved'"),
      pool.query("SELECT COUNT(*) FROM service_requests WHERE status = 'assigned'"),
      pool.query("SELECT COUNT(*) FROM service_requests WHERE status = 'in_progress'"),
      pool.query("SELECT COUNT(*) FROM service_requests WHERE status = 'completed'"),
      pool.query("SELECT id, first_name, last_name FROM users WHERE role = 'technician' AND is_active = true")
    ]);

    const pendingServiceRequests = requestsResult.rows.length;
    const pendingOutages = outagesResult.rows.length;
    const approvedRequests = parseInt(approvedResult.rows[0].count);
    const assignedTasks = parseInt(assignedResult.rows[0].count);
    const inProgressTasks = parseInt(inProgressResult.rows[0].count);
    const completedTasks = parseInt(completedResult.rows[0].count);

    const stats = {
      total: pendingServiceRequests + pendingOutages,
      pending: pendingServiceRequests + pendingOutages,
      assigned: assignedTasks,
      in_progress: inProgressTasks,
      completed: completedTasks
    };

    res.json({
      success: true,
      data: {
        stats,
        pendingRequests: requestsResult.rows,
        pendingOutages: outagesResult.rows,
        activeTechnicians: techsResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching supervisor dashboard:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
