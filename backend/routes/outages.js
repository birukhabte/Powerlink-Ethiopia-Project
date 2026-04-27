const express = require('express');
const pool = require('../config/database');
const { createNotification } = require('../utils/notifications');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all outages (for map display)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        title, 
        description, 
        outage_type, 
        urgency, 
        status,
        latitude,
        longitude,
        address,
        estimated_affected,
        created_at,
        updated_at
      FROM outage_reports 
      WHERE status != 'resolved'
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      outages: result.rows
    });
  } catch (error) {
    console.error('Error fetching outages:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch outages' 
    });
  }
});

// Get outages by user (for customers to track their reports)
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(`
      SELECT 
        o.*,
        CONCAT(u.first_name, ' ', u.last_name) AS assigned_to_name
      FROM outage_reports o
      LEFT JOIN users u ON o.assigned_to = u.id
      WHERE o.reported_by = $1
      ORDER BY o.created_at DESC
    `, [userId]);

    res.json({
      success: true,
      outages: result.rows
    });
  } catch (error) {
    console.error('Error fetching user outages:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch outages' 
    });
  }
});

// Get all outages for supervisors/admins (with assignment info)
router.get('/manage', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.*,
        CONCAT(r.first_name, ' ', r.last_name) AS reported_by_name,
        CONCAT(a.first_name, ' ', a.last_name) AS assigned_to_name
      FROM outage_reports o
      LEFT JOIN users r ON o.reported_by = r.id
      LEFT JOIN users a ON o.assigned_to = a.id
      ORDER BY 
        CASE o.status 
          WHEN 'pending' THEN 1 
          WHEN 'assigned' THEN 2 
          WHEN 'in_progress' THEN 3 
          WHEN 'resolved' THEN 4 
        END,
        CASE o.urgency 
          WHEN 'high' THEN 1 
          WHEN 'medium' THEN 2 
          WHEN 'low' THEN 3 
        END,
        o.created_at DESC
    `);

    res.json({
      success: true,
      outages: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching outages for management:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch outages' 
    });
  }
});

// Create new outage report
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      outage_type,
      urgency,
      latitude,
      longitude,
      address,
      estimated_affected,
      reason,
      reported_by
    } = req.body;

    // Validate required fields
    if (!title || !description || !address) {
      return res.status(400).json({
        success: false,
        error: 'Title, description, and address are required'
      });
    }

    // Check if user is a special customer and set urgency accordingly
    let finalUrgency = urgency || 'medium'; // default
    if (reported_by) {
      try {
        const userResult = await pool.query('SELECT special_customer FROM users WHERE id = $1', [reported_by]);
        if (userResult.rows.length > 0 && userResult.rows[0].special_customer) {
          finalUrgency = 'high'; // Special customers get high urgency
        }
      } catch (userErr) {
        console.error('Error checking user special status:', userErr.message);
        // Continue with provided or default urgency if check fails
      }
    }

    const result = await pool.query(`
      INSERT INTO outage_reports (
        title,
        description,
        outage_type,
        urgency,
        latitude,
        longitude,
        address,
        estimated_affected,
        reason,
        reported_by,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending')
      RETURNING *
    `, [
      title,
      description,
      outage_type,
      finalUrgency,
      latitude,
      longitude,
      address,
      estimated_affected,
      reason,
      reported_by
    ]);

    const newOutage = result.rows[0];

    // Notify supervisors about new outage report with urgency indication
    try {
      const supervisors = await pool.query(
        "SELECT id FROM users WHERE role IN ('supervisor', 'admin') AND is_active = true"
      );

      const io = req.app?.get('io');
      const urgencyText = finalUrgency === 'high' ? 'URGENT - ' : '';
      await Promise.all(supervisors.rows.map(async (sup) => {
        const notif = await createNotification({
          userId: sup.id,
          title: `${urgencyText}New Outage Reported ⚠️`,
          message: `New ${outage_type || 'unspecified'} outage at ${address}. Urgency: ${finalUrgency}${finalUrgency === 'high' ? ' - SPECIAL CUSTOMER - Requires immediate attention!' : ''}`,
          type: finalUrgency === 'high' ? 'alert' : 'alert',
        });
        if (io && notif) io.to(`user-${sup.id}`).emit('notification', notif);
      }));
    } catch (notifErr) {
      console.error('Notification error (non-fatal):', notifErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Outage report created successfully',
      outage: newOutage
    });
  } catch (error) {
    console.error('Error creating outage report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create outage report'
    });
  }
});

// Update outage status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, technician_notes } = req.body;

    const result = await pool.query(`
      UPDATE outage_reports 
      SET 
        status = $1,
        technician_notes = COALESCE($2, technician_notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [status, technician_notes, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Outage report not found' 
      });
    }

    const updatedOutage = result.rows[0];
    const io = req.app?.get('io');

    // Notify the original reporter if status changed
    if (updatedOutage.reported_by && status !== 'pending') {
      try {
        const notif = await createNotification({
          userId: updatedOutage.reported_by,
          title: 'Outage Update',
          message: `Your reported outage "${updatedOutage.title}" is now ${status}.`,
          type: status === 'resolved' ? 'success' : 'info',
        });
        if (io && notif) io.to(`user-${updatedOutage.reported_by}`).emit('notification', notif);
      } catch (notifErr) {
        console.error('Notification error (non-fatal):', notifErr.message);
      }
    }

    res.json({
      success: true,
      message: 'Outage status updated successfully',
      outage: updatedOutage
    });
  } catch (error) {
    console.error('Error updating outage status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update outage status' 
    });
  }
});

// Update outage assignment (for supervisors)
router.patch('/:id/assign', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned_to, supervisor_notes, scheduled_date } = req.body;

    // Get existing outage first
    const existingResult = await pool.query('SELECT * FROM outage_reports WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Outage report not found' });
    }
    const existing = existingResult.rows[0];

    const result = await pool.query(`
      UPDATE outage_reports
      SET
        assigned_to = COALESCE($1, assigned_to),
        status = CASE WHEN $1 IS NOT NULL AND status = 'pending' THEN 'assigned' ELSE status END,
        scheduled_date = COALESCE($2, scheduled_date),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [assigned_to, scheduled_date, id]);

    const updated = result.rows[0];

    console.log(`Outage ${id} assigned to technician ${assigned_to}, status: ${updated.status}`);

    // Trigger notifications
    const io = req.app?.get('io');
    try {
      // Notify newly assigned technician
      if (assigned_to && assigned_to !== existing.assigned_to) {
        const notif = await createNotification({
          userId: assigned_to,
          title: 'New Outage Task Assigned',
          message: `You have been assigned to resolve outage: ${updated.title} (${updated.outage_type})`,
          type: 'info',
        });
        if (io && notif) {
          io.to(`user-${assigned_to}`).emit('notification', notif);
          // Emit task update for real-time dashboard refresh
          io.to(`user-${assigned_to}`).emit('task-update', {
            type: 'outage_report',
            action: 'assigned',
            taskId: updated.id
          });
        }
      }

      // Notify customer of assignment
      if (assigned_to && updated.reported_by) {
        const notif = await createNotification({
          userId: updated.reported_by,
          title: 'Outage Report Assigned',
          message: `A technician has been assigned to resolve your outage report: "${updated.title}".`,
          type: 'info',
        });
        if (io && notif) io.to(`user-${updated.reported_by}`).emit('notification', notif);
      }
    } catch (notifErr) {
      console.error('Notification error (non-fatal):', notifErr.message);
    }

    res.json({ success: true, message: 'Outage assignment updated successfully', outage: updated });
  } catch (error) {
    console.error('Error updating outage assignment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update outage assignment' 
    });
  }
});

module.exports = router;