/**
 * Notification Helper
 * Central utility for creating notifications in the database.
 * Used by route handlers to notify users of important events.
 */
const prisma = require('../config/prisma');

/**
 * Create a notification for a user
 * @param {Object} params
 * @param {number}  params.userId   - Target user ID
 * @param {string}  params.title    - Notification title
 * @param {string}  params.message  - Notification message
 * @param {string}  [params.type]   - 'info' | 'alert' | 'success'
 */
const createNotification = async ({ userId, title, message, type = 'info' }) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        user_id: parseInt(userId),
        title,
        message,
        type,
        is_read: false,
      },
    });
    return notification;
  } catch (error) {
    // Don't throw — notifications are non-critical side effects
    console.error('⚠️ Failed to create notification:', error.message);
    return null;
  }
};

/**
 * Emit a real-time notification via Socket.IO (if io is available)
 * @param {Object} io           - Socket.IO server instance
 * @param {number} userId       - Target user ID
 * @param {Object} notification - The notification object
 */
const emitNotification = (io, userId, notification) => {
  if (io && notification) {
    io.to(`user-${userId}`).emit('notification', notification);
  }
};

module.exports = { createNotification, emitNotification };
