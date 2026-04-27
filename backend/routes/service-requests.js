const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { createNotification } = require('../utils/notifications');

const router = express.Router();

// =====================
// GET ALL SERVICE REQUESTS (Supervisor/Admin view)
// =====================
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        sr.*,
        CONCAT(u.first_name, ' ', u.last_name) AS assigned_to_name
      FROM service_requests sr
      LEFT JOIN users u ON sr.assigned_to = u.id
      ORDER BY 
        CASE sr.status 
          WHEN 'pending' THEN 1 
          WHEN 'under_review' THEN 2 
          WHEN 'approved' THEN 3 
          WHEN 'assigned' THEN 4 
          WHEN 'in_progress' THEN 5 
          WHEN 'completed' THEN 6 
          WHEN 'rejected' THEN 7 
        END,
        CASE sr.priority 
          WHEN 'high' THEN 1 
          WHEN 'medium' THEN 2 
          WHEN 'low' THEN 3 
        END,
        sr.created_at DESC
    `);

    res.json({ success: true, requests: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Error fetching service requests:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch service requests' });
  }
});

// =====================
// GET PENDING REQUESTS
// =====================
router.get('/pending', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT sr.*, CONCAT(u.first_name, ' ', u.last_name) AS assigned_to_name
      FROM service_requests sr
      LEFT JOIN users u ON sr.assigned_to = u.id
      WHERE sr.status IN ('pending', 'under_review')
      ORDER BY 
        CASE sr.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END,
        sr.created_at ASC
    `);
    res.json({ success: true, requests: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch pending requests' });
  }
});

// =====================
// GET REQUESTS BY USER (Customer ticket tracking)
// =====================
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      SELECT 
        sr.*,
        CONCAT(u.first_name, ' ', u.last_name) AS assigned_to_name
      FROM service_requests sr
      LEFT JOIN users u ON sr.assigned_to = u.id
      WHERE sr.created_by = $1
      ORDER BY sr.created_at DESC
    `, [userId]);

    res.json({ success: true, tickets: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user tickets' });
  }
});

// =====================
// GET SINGLE SERVICE REQUEST
// =====================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM service_requests WHERE id = $1', [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Service request not found' });
    }
    res.json({ success: true, request: result.rows[0] });
  } catch (error) {
    console.error('Error fetching service request:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch service request' });
  }
});

// =====================
// CREATE NEW SERVICE REQUEST
// =====================
router.post('/', async (req, res) => {
  try {
    const {
      ticket_id, ticketId,
      service_type, serviceType,
      full_name, fullName,
      phone,
      city, woreda, kebele,
      house_plot_number, housePlotNumber,
      nearby_landmark, nearbyLandmark,
      full_address, fullAddress,
      documents,
      created_by, createdBy,
    } = req.body;

    // Normalize camelCase vs snake_case
    const ticketIdVal    = ticketId    || ticket_id;
    const serviceTypeVal = serviceType || service_type;
    const fullNameVal    = fullName    || full_name;
    const housePlotVal   = housePlotNumber || house_plot_number;
    const landmarkVal    = nearbyLandmark  || nearby_landmark;
    const fullAddressVal = fullAddress || full_address;
    const createdByVal   = createdBy   || created_by;

    if (!ticketIdVal || !serviceTypeVal || !fullNameVal || !phone || !fullAddressVal) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Check if user is a special customer and set priority accordingly
    let priority = 'medium'; // default
    if (createdByVal) {
      try {
        const userResult = await pool.query('SELECT special_customer FROM users WHERE id = $1', [createdByVal]);
        if (userResult.rows.length > 0 && userResult.rows[0].special_customer) {
          priority = 'high'; // Special customers get high priority
        }
      } catch (userErr) {
        console.error('Error checking user special status:', userErr.message);
        // Continue with default priority if check fails
      }
    }

    const result = await pool.query(`
      INSERT INTO service_requests (
        ticket_id, service_type, full_name, phone,
        city, woreda, kebele, house_plot_number, nearby_landmark,
        full_address, documents, created_by, status, priority
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending', $13)
      RETURNING *
    `, [
      ticketIdVal, serviceTypeVal, fullNameVal, phone,
      city, woreda, kebele, housePlotVal, landmarkVal,
      fullAddressVal, JSON.stringify(documents || []), createdByVal, priority
    ]);

    const newRequest = result.rows[0];

    // Notify supervisors about new service request with priority indication
    try {
      const supervisors = await pool.query(
        "SELECT id FROM users WHERE role IN ('supervisor', 'admin') AND is_active = true"
      );
      const priorityText = priority === 'high' ? 'URGENT - ' : '';
      await Promise.all(supervisors.rows.map(sup =>
        createNotification({
          userId: sup.id,
          title: `${priorityText}New Service Request`,
          message: `New ${serviceTypeVal} request submitted by ${fullNameVal} (Ticket: ${ticketIdVal})${priority === 'high' ? ' - SPECIAL CUSTOMER - Requires immediate attention!' : ''}`,
          type: priority === 'high' ? 'alert' : 'info',
        })
      ));
    } catch (notifErr) {
      console.error('Notification error (non-fatal):', notifErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Service request created successfully',
      request: newRequest,
    });
  } catch (error) {
    console.error('Error creating service request:', error);
    res.status(500).json({ success: false, error: 'Failed to create service request' });
  }
});

// =====================
// UPDATE SERVICE REQUEST (status/priority/notes/assignment)
// =====================
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, supervisor_notes, assigned_to } = req.body;

    // Get existing request first
    const existingResult = await pool.query('SELECT * FROM service_requests WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Service request not found' });
    }
    const existing = existingResult.rows[0];

    const result = await pool.query(`
      UPDATE service_requests
      SET
        status = COALESCE($1, status),
        priority = COALESCE($2, priority),
        supervisor_notes = COALESCE($3, supervisor_notes),
        assigned_to = COALESCE($4, assigned_to),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `, [status, priority, supervisor_notes, assigned_to, id]);

    const updated = result.rows[0];

    // Trigger notifications for assignment or status change
    const io = req.app?.get('io');
    try {
      // Notify newly assigned technician
      if (assigned_to && assigned_to !== existing.assigned_to) {
        const notif = await createNotification({
          userId: assigned_to,
          title: 'New Task Assigned',
          message: `You have been assigned to service request: ${updated.ticket_id} (${updated.service_type})`,
          type: 'info',
        });
        if (io && notif) {
          io.to(`user-${assigned_to}`).emit('notification', notif);
          // Emit task update for real-time dashboard refresh
          io.to(`user-${assigned_to}`).emit('task-update', {
            type: 'service_request',
            action: 'assigned',
            taskId: updated.id
          });
        }
      }

      // Notify customer of status change
      if (status && status !== existing.status && updated.created_by) {
        const statusMessages = {
          approved: 'Your service request has been approved!',
          rejected: 'Your service request was not approved.',
          in_progress: 'Work on your service request has begun.',
          completed: 'Your service request has been completed!',
          assigned: 'A technician has been assigned to your request.',
        };
        if (statusMessages[status]) {
          const notif = await createNotification({
            userId: updated.created_by,
            title: `Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message: `${statusMessages[status]} (Ticket: ${updated.ticket_id})`,
            type: status === 'completed' || status === 'approved' ? 'success' : status === 'rejected' ? 'alert' : 'info',
          });
          if (io && notif) io.to(`user-${updated.created_by}`).emit('notification', notif);
        }
      }
    } catch (notifErr) {
      console.error('Notification error (non-fatal):', notifErr.message);
    }

    res.json({ success: true, message: 'Service request updated successfully', request: updated });
  } catch (error) {
    console.error('Error updating service request:', error);
    res.status(500).json({ success: false, error: 'Failed to update service request' });
  }
});

// =====================
// APPROVE REQUEST
// =====================
router.post('/:id/approve', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { supervisor_notes, assigned_to } = req.body;

    const result = await pool.query(`
      UPDATE service_requests
      SET status = 'approved',
          supervisor_notes = COALESCE($1, supervisor_notes),
          assigned_to = COALESCE($2, assigned_to),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [supervisor_notes, assigned_to, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Service request not found' });
    }

    const updated = result.rows[0];
    const io = req.app?.get('io');

    // Notify customer
    if (updated.created_by) {
      const notif = await createNotification({
        userId: updated.created_by,
        title: 'Request Approved ✅',
        message: `Your service request (${updated.ticket_id}) has been approved!`,
        type: 'success',
      });
      if (io && notif) io.to(`user-${updated.created_by}`).emit('notification', notif);
    }
    // Notify assigned technician
    if (assigned_to) {
      const notif = await createNotification({
        userId: assigned_to,
        title: 'Task Assigned',
        message: `You have been assigned to ticket ${updated.ticket_id} (${updated.service_type})`,
        type: 'info',
      });
      if (io && notif) {
        io.to(`user-${assigned_to}`).emit('notification', notif);
        // Emit task update for real-time dashboard refresh
        io.to(`user-${assigned_to}`).emit('task-update', {
          type: 'service_request',
          action: 'assigned',
          taskId: updated.id
        });
      }
    }

    res.json({ success: true, message: 'Service request approved', request: updated });
  } catch (error) {
    console.error('Error approving service request:', error);
    res.status(500).json({ success: false, error: 'Failed to approve service request' });
  }
});

// =====================
// REJECT REQUEST
// =====================
router.post('/:id/reject', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { supervisor_notes } = req.body;

    const result = await pool.query(`
      UPDATE service_requests
      SET status = 'rejected',
          supervisor_notes = COALESCE($1, supervisor_notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [supervisor_notes, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Service request not found' });
    }

    const updated = result.rows[0];
    const io = req.app?.get('io');

    // Notify customer of rejection
    if (updated.created_by) {
      const notif = await createNotification({
        userId: updated.created_by,
        title: 'Request Update',
        message: `Your service request (${updated.ticket_id}) could not be approved. ${supervisor_notes ? 'Reason: ' + supervisor_notes : ''}`,
        type: 'alert',
      });
      if (io && notif) io.to(`user-${updated.created_by}`).emit('notification', notif);
    }

    res.json({ success: true, message: 'Service request rejected', request: updated });
  } catch (error) {
    console.error('Error rejecting service request:', error);
    res.status(500).json({ success: false, error: 'Failed to reject service request' });
  }
});

module.exports = router;
