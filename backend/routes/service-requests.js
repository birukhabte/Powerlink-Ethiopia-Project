const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Get all service requests (for supervisor)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        ticket_id,
        service_type,
        full_name,
        phone,
        city,
        woreda,
        kebele,
        full_address,
        documents,
        status,
        priority,
        assigned_to,
        supervisor_notes,
        created_at,
        updated_at
      FROM service_requests
      ORDER BY 
        CASE status 
          WHEN 'pending' THEN 1 
          WHEN 'under_review' THEN 2 
          WHEN 'approved' THEN 3 
          WHEN 'assigned' THEN 4 
          WHEN 'in_progress' THEN 5 
          WHEN 'completed' THEN 6 
          WHEN 'rejected' THEN 7 
        END,
        CASE priority 
          WHEN 'high' THEN 1 
          WHEN 'medium' THEN 2 
          WHEN 'low' THEN 3 
        END,
        created_at DESC
    `);

    res.json({
      success: true,
      requests: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching service requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch service requests'
    });
  }
});

// Get pending service requests only
router.get('/pending', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        ticket_id,
        service_type,
        full_name,
        phone,
        city,
        woreda,
        kebele,
        full_address,
        documents,
        status,
        priority,
        created_at
      FROM service_requests
      WHERE status IN ('pending', 'under_review')
      ORDER BY 
        CASE priority 
          WHEN 'high' THEN 1 
          WHEN 'medium' THEN 2 
          WHEN 'low' THEN 3 
        END,
        created_at ASC
    `);

    res.json({
      success: true,
      requests: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pending requests'
    });
  }
});

// Get single service request by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM service_requests WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Service request not found'
      });
    }

    res.json({
      success: true,
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching service request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch service request'
    });
  }
});

// Get service requests by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    console.log('=== BACKEND: Fetching tickets for user ===');
    console.log('User ID:', userId);

    const result = await pool.query(`
      SELECT 
        sr.id,
        sr.ticket_id,
        sr.service_type,
        sr.full_name,
        sr.phone,
        sr.city,
        sr.woreda,
        sr.kebele,
        sr.full_address,
        sr.documents,
        sr.status,
        sr.priority,
        sr.assigned_to,
        sr.supervisor_notes,
        sr.created_at,
        sr.updated_at,
        CONCAT(u.first_name, ' ', u.last_name) as assigned_to_username
      FROM service_requests sr
      LEFT JOIN users u ON sr.assigned_to = u.id
      WHERE sr.created_by = $1
      ORDER BY sr.created_at DESC
    `, [userId]);

    console.log('Query result:', result.rows.length, 'tickets found');
    console.log('Tickets:', result.rows);

    res.json({
      success: true,
      tickets: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user tickets'
    });
  }
});

// Create new service request
router.post('/', async (req, res) => {
  try {
    // Support both camelCase (from frontend) and snake_case
    const {
      ticket_id,
      ticketId,
      service_type,
      serviceType,
      full_name,
      fullName,
      phone,
      city,
      woreda,
      kebele,
      house_plot_number,
      housePlotNumber,
      nearby_landmark,
      nearbyLandmark,
      full_address,
      fullAddress,
      documents,
      created_by,
      createdBy
    } = req.body;

    // Use camelCase values if available, otherwise use snake_case
    const ticketIdValue = ticketId || ticket_id;
    const serviceTypeValue = serviceType || service_type;
    const fullNameValue = fullName || full_name;
    const housePlotNumberValue = housePlotNumber || house_plot_number;
    const nearbyLandmarkValue = nearbyLandmark || nearby_landmark;
    const fullAddressValue = fullAddress || full_address;
    const createdByValue = createdBy || created_by;

    // Validate required fields
    if (!ticketIdValue || !serviceTypeValue || !fullNameValue || !phone || !fullAddressValue) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const result = await pool.query(`
      INSERT INTO service_requests (
        ticket_id,
        service_type,
        full_name,
        phone,
        city,
        woreda,
        kebele,
        house_plot_number,
        nearby_landmark,
        full_address,
        documents,
        created_by,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending')
      RETURNING *
    `, [
      ticketIdValue,
      serviceTypeValue,
      fullNameValue,
      phone,
      city,
      woreda,
      kebele,
      housePlotNumberValue,
      nearbyLandmarkValue,
      fullAddressValue,
      JSON.stringify(documents || []),
      createdByValue
    ]);

    res.status(201).json({
      success: true,
      message: 'Service request created successfully',
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating service request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create service request'
    });
  }
});

// Update service request status and notes
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, supervisor_notes, assigned_to } = req.body;

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

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Service request not found'
      });
    }

    res.json({
      success: true,
      message: 'Service request updated successfully',
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating service request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update service request'
    });
  }
});

// Approve service request
router.post('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { supervisor_notes } = req.body;

    const result = await pool.query(`
      UPDATE service_requests
      SET
        status = 'approved',
        supervisor_notes = COALESCE($1, supervisor_notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [supervisor_notes, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Service request not found'
      });
    }

    res.json({
      success: true,
      message: 'Service request approved',
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Error approving service request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve service request'
    });
  }
});

// Reject service request
router.post('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { supervisor_notes } = req.body;

    const result = await pool.query(`
      UPDATE service_requests
      SET
        status = 'rejected',
        supervisor_notes = COALESCE($1, supervisor_notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [supervisor_notes, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Service request not found'
      });
    }

    res.json({
      success: true,
      message: 'Service request rejected',
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Error rejecting service request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject service request'
    });
  }
});

module.exports = router;
