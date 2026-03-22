const express = require('express');
const pool = require('../config/database');

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
      urgency, 
      latitude, 
      longitude, 
      address, 
      estimated_affected,
      reason,
      reported_by
    ]);

    res.status(201).json({
      success: true,
      message: 'Outage report created successfully',
      outage: result.rows[0]
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
router.patch('/:id/status', async (req, res) => {
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

    res.json({
      success: true,
      message: 'Outage status updated successfully',
      outage: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating outage status:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update outage status' 
    });
  }
});

module.exports = router;