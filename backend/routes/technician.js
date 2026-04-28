/**
 * Technician Routes
 * Provides endpoints for technicians to view and update their assigned tasks.
 */
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { createNotification } = require('../utils/notifications');

/**
 * GET /api/technician/tasks
 * Fetch all tasks assigned to the current technician
 */
router.get('/tasks', authenticateToken, authorizeRoles('technician'), async (req, res) => {
  try {
    const technicianId = req.user.userId;
    
    // Fetch both service requests and outage reports assigned to this tech
    const [requestsResult, outagesResult] = await Promise.all([
      pool.query(`
        SELECT 'service_request' as type, sr.* 
        FROM service_requests sr 
        WHERE sr.assigned_to = $1 
        ORDER BY sr.created_at DESC
      `, [technicianId]),
      pool.query(`
        SELECT 'outage_report' as type, o.* 
        FROM outage_reports o 
        WHERE o.assigned_to = $1 AND o.status != 'resolved'
        ORDER BY o.created_at DESC
      `, [technicianId])
    ]);

    const tasks = [...requestsResult.rows, ...outagesResult.rows].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );

    console.log(`Technician ${technicianId} has ${tasks.length} tasks:`, tasks.map(t => ({type: t.type, id: t.id, status: t.status})));

    res.json({ success: true, tasks, count: tasks.length });
  } catch (error) {
    console.error('Error fetching technician tasks:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch tasks' });
  }
});

/**
 * PATCH /api/technician/task/:type/:id
 * Update task status and progress
 */
router.patch('/task/:type/:id', authenticateToken, authorizeRoles('technician'), async (req, res) => {
  try {
    const { type, id } = req.params;
    const { status, notes, estimated_time, evidence_image } = req.body;
    const technicianId = req.user.userId;

    let table = type === 'service_request' ? 'service_requests' : 'outage_reports';
    
    // Verify assignment
    const verify = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
    if (verify.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    if (verify.rows[0].assigned_to !== technicianId) {
      return res.status(403).json({ success: false, error: 'Not authorized to update this task' });
    }

    const result = await pool.query(`
      UPDATE ${table}
      SET status = $1,
          technician_notes = $2,
          estimated_time = $3,
          evidence_image = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `, [status, notes, estimated_time, evidence_image, id]);

    const updatedTask = result.rows[0];
    const io = req.app?.get('io');

    // Notify customer and supervisor of progress
    try {
      const recipientId = updatedTask.created_by || updatedTask.reported_by;
      if (recipientId) {
        const notif = await createNotification({
          userId: recipientId,
          title: 'Work Update ⚡',
          message: `Your request (${updatedTask.ticket_id || updatedTask.title}) is now ${status}. ${estimated_time ? 'Estimated time: ' + estimated_time : ''}`,
          type: status === 'completed' || status === 'resolved' ? 'success' : 'info',
        });
        if (io && notif) io.to(`user-${recipientId}`).emit('notification', notif);
      }

      // Notify supervisors
      const supervisors = await pool.query("SELECT id FROM users WHERE role = 'supervisor'");
      await Promise.all(supervisors.rows.map(async (sup) => {
        const sNotif = await createNotification({
          userId: sup.id,
          title: 'Task Progress Update',
          message: `Technician ${req.user.username} updated task ${updatedTask.ticket_id || updatedTask.title} to ${status}`,
          type: 'info',
        });
        if (io && sNotif) io.to(`user-${sup.id}`).emit('notification', sNotif);
      }));

      // Emit task update for real-time dashboard refresh
      if (io) {
        io.emit('task-update', {
          type: table === 'service_requests' ? 'service_request' : 'outage_report',
          action: 'updated',
          taskId: updatedTask.id,
          status: status,
          technicianId: req.user.userId
        });
      }
    } catch (notifErr) {
      console.error('Notification error (non-fatal):', notifErr.message);
    }

    res.json({ success: true, message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    console.error('Error updating technician task:', error);
    res.status(500).json({ success: false, error: 'Failed to update task' });
  }
});

module.exports = router;
