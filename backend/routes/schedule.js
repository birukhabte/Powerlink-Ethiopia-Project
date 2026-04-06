const express = require('express');
const prisma = require('../config/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all tasks (OutageReports + ServiceRequests) for the technician
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const role = req.user.role;

    if (role !== 'technician') {
      return res.status(403).json({ success: false, error: 'Only technicians can access schedule' });
    }

    // Fetch OutageReports assigned to this technician
    const outages = await prisma.outageReport.findMany({
      where: { assigned_to: userId },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        urgency: true,
        scheduled_date: true,
        latitude: true,
        longitude: true,
        address: true,
        created_at: true
      },
      orderBy: { scheduled_date: 'asc' }
    });

    // Fetch ServiceRequests assigned to this technician
    const serviceRequests = await prisma.serviceRequest.findMany({
      where: { assigned_to: userId },
      select: {
        id: true,
        ticket_id: true,
        service_type: true,
        full_name: true,
        status: true,
        priority: true,
        scheduled_date: true,
        full_address: true,
        created_at: true
      },
      orderBy: { scheduled_date: 'asc' }
    });

    // Combine and format for FullCalendar
    const schedule = [
      ...outages.map(o => ({
        id: `outage-${o.id}`,
        type: 'outage',
        originalId: o.id,
        title: `Outage: ${o.title}`,
        start: o.scheduled_date || o.created_at,
        extendedProps: { ...o }
      })),
      ...serviceRequests.map(s => ({
        id: `service-${s.id}`,
        type: 'service',
        originalId: s.id,
        title: `Service: ${s.service_type}`,
        start: s.scheduled_date || s.created_at,
        extendedProps: { ...s }
      }))
    ];

    res.json({ success: true, schedule });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch schedule' });
  }
});

// Update the scheduled date for a task
router.patch('/update-date', authenticateToken, async (req, res) => {
  try {
    const { id, type, scheduled_date } = req.body;
    const userId = req.user.userId;

    if (type === 'outage') {
      await prisma.outageReport.updateMany({
        where: { id: parseInt(id), assigned_to: userId },
        data: { scheduled_date: new Date(scheduled_date) }
      });
    } else if (type === 'service') {
      await prisma.serviceRequest.updateMany({
        where: { id: parseInt(id), assigned_to: userId },
        data: { scheduled_date: new Date(scheduled_date) }
      });
    } else {
      return res.status(400).json({ success: false, error: 'Invalid task type' });
    }

    res.json({ success: true, message: 'Scheduled date updated' });
  } catch (error) {
    console.error('Error updating scheduled date:', error);
    res.status(500).json({ success: false, error: 'Failed to update scheduled date' });
  }
});

module.exports = router;
