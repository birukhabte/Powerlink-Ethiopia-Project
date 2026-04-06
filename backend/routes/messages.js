const express = require('express');
const prisma = require('../config/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all messages for the current user (sent or received)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      include: {
        sender: {
          select: { id: true, username: true, first_name: true, last_name: true, role: true }
        },
        receiver: {
          select: { id: true, username: true, first_name: true, last_name: true, role: true }
        }
      },
      orderBy: { created_at: 'asc' }
    });

    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { receiver_id, content } = req.body;
    const sender_id = req.user.userId;

    if (!receiver_id || !content) {
      return res.status(400).json({ success: false, error: 'Receiver ID and content are required' });
    }

    const message = await prisma.message.create({
      data: {
        sender_id,
        receiver_id: parseInt(receiver_id),
        content
      },
      include: {
        sender: {
          select: { id: true, username: true, first_name: true, last_name: true }
        },
        receiver: {
          select: { id: true, username: true, first_name: true, last_name: true }
        }
      }
    });

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

// Mark messages as read
router.patch('/read/:senderId', authenticateToken, async (req, res) => {
  try {
    const receiver_id = req.user.userId;
    const sender_id = parseInt(req.params.senderId);

    await prisma.message.updateMany({
      where: {
        sender_id,
        receiver_id,
        is_read: false
      },
      data: { is_read: true }
    });

    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ success: false, error: 'Failed to update message status' });
  }
});

module.exports = router;
