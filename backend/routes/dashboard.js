const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

/**
 * @route   GET /api/dashboard/technician
 * @desc    Get technician dashboard data (stats and assigned tasks)
 * @access  Private (Technician only)
 */
router.get('/technician', authenticateToken, authorizeRoles('technician'), async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch tasks assigned to this technician
    const tasks = await prisma.serviceRequest.findMany({
      where: {
        assigned_to: userId,
      },
      orderBy: [
        { priority: 'asc' }, // You might need a custom sort for high/medium/low string values
        { created_at: 'desc' },
      ],
      include: {
        creator: {
          select: {
            first_name: true,
            last_name: true,
          }
        }
      }
    });

    // Calculate stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'assigned' || t.status === 'in_progress').length;
    
    // Tasks scheduled for today
    const tasksToday = tasks.filter(t => {
      if (!t.scheduled_date) return false;
      const scheduledDate = new Date(t.scheduled_date);
      scheduledDate.setHours(0, 0, 0, 0);
      return scheduledDate.getTime() === today.getTime();
    }).length;

    res.json({
      success: true,
      data: {
        stats: {
          tasksToday: tasksToday || totalTasks, // Fallback if no specific scheduling
          completed: `${completedTasks}/${totalTasks}`,
          avgTime: '1.2 hrs', // This would need actual tracking logic
          rating: '4.8/5',    // This would need a rating system
        },
        tasks: tasks.map(t => ({
          id: t.ticket_id,
          db_id: t.id,
          location: `${t.city || ''}, ${t.woreda || ''}`,
          type: t.service_type,
          status: t.status === 'assigned' ? 'Pending' : 
                  t.status === 'in_progress' ? 'In Progress' : 
                  t.status === 'completed' ? 'Completed' : t.status,
          priority: t.priority.charAt(0).toUpperCase() + t.priority.slice(1),
          time: t.scheduled_date ? new Date(t.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Flexible',
          full_address: t.full_address,
          customer_name: t.full_name
        }))
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
    // Fetch all pending and under_review requests
    const pendingRequests = await prisma.serviceRequest.findMany({
      where: {
        status: {
          in: ['pending', 'under_review']
        }
      },
      orderBy: {
        created_at: 'asc'
      }
    });

    // Fetch active technicians count (users with role 'technician' and is_active true)
    const activeTechniciansCount = await prisma.user.count({
      where: {
        role: 'technician',
        is_active: true
      }
    });

    const totalTechnicians = await prisma.user.count({
      where: { role: 'technician' }
    });

    // Stats for supervisor
    const stats = {
      pendingValidations: pendingRequests.length,
      activeTechnicians: `${activeTechniciansCount}/${totalTechnicians}`,
      openRequests: pendingRequests.length,
      avgResponseTime: '1.5 hrs' // Placeholder
    };

    res.json({
      success: true,
      data: {
        stats,
        requests: pendingRequests
      }
    });
  } catch (error) {
    console.error('Error fetching supervisor dashboard:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
