const express = require('express');
const prisma = require('../config/prisma');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// =====================
// GET all contacts (users the current user has chatted with)
// =====================
router.get('/contacts', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all messages involving this user
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ sender_id: userId }, { receiver_id: userId }],
      },
      include: {
        sender: { select: { id: true, username: true, first_name: true, last_name: true, role: true } },
        receiver: { select: { id: true, username: true, first_name: true, last_name: true, role: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    // Build contacts map (latest message per contact)
    const contactsMap = {};
    messages.forEach(msg => {
      const contact = msg.sender_id === userId ? msg.receiver : msg.sender;
      if (!contactsMap[contact.id]) {
        contactsMap[contact.id] = {
          ...contact,
          lastMessage: msg.content,
          lastMessageTime: msg.created_at,
          unreadCount: (!msg.is_read && msg.receiver_id === userId) ? 1 : 0,
        };
      } else {
        if (!msg.is_read && msg.receiver_id === userId) {
          contactsMap[contact.id].unreadCount++;
        }
      }
    });

    res.json({ success: true, contacts: Object.values(contactsMap) });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch contacts' });
  }
});

// =====================
// GET conversation with a specific user
// =====================
router.get('/conversation/:userId', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const otherUserId = parseInt(req.params.userId);

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { sender_id: currentUserId, receiver_id: otherUserId },
          { sender_id: otherUserId, receiver_id: currentUserId },
        ],
      },
      include: {
        sender: { select: { id: true, username: true, first_name: true, last_name: true, role: true } },
        receiver: { select: { id: true, username: true, first_name: true, last_name: true, role: true } },
      },
      orderBy: { created_at: 'asc' },
    });

    // Mark as read
    await prisma.message.updateMany({
      where: {
        sender_id: otherUserId,
        receiver_id: currentUserId,
        is_read: false,
      },
      data: { is_read: true },
    });

    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch conversation' });
  }
});

// =====================
// GET all messages for current user (fallback / admin use)
// =====================
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ sender_id: userId }, { receiver_id: userId }],
      },
      include: {
        sender: { select: { id: true, username: true, first_name: true, last_name: true, role: true } },
        receiver: { select: { id: true, username: true, first_name: true, last_name: true, role: true } },
      },
      orderBy: { created_at: 'asc' },
    });

    res.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
});

// =====================
// GET all staff users (for starting a new chat)
// =====================
router.get('/staff', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const staff = await prisma.user.findMany({
      where: {
        id: { not: userId },
        role: { in: ['admin', 'supervisor', 'technician'] },
        is_active: true,
      },
      select: {
        id: true,
        username: true,
        first_name: true,
        last_name: true,
        role: true,
        email: true,
      },
      orderBy: [{ role: 'asc' }, { first_name: 'asc' }],
    });

    res.json({ success: true, staff });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch staff' });
  }
});

// =====================
// SEND a message
// =====================
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { receiver_id, content } = req.body;
    const sender_id = req.user.userId;

    if (!receiver_id || !content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Receiver ID and content are required' });
    }

    const message = await prisma.message.create({
      data: {
        sender_id,
        receiver_id: parseInt(receiver_id),
        content: content.trim(),
      },
      include: {
        sender: { select: { id: true, username: true, first_name: true, last_name: true, role: true } },
        receiver: { select: { id: true, username: true, first_name: true, last_name: true, role: true } },
      },
    });

    // Emit via Socket.IO for real-time delivery
    const io = req.app?.get('io');
    if (io) {
      io.to(`user-${receiver_id}`).emit('receive_message', message);
    }

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

// =====================
// MARK messages as read from a specific sender
// =====================
router.patch('/read/:senderId', authenticateToken, async (req, res) => {
  try {
    const receiver_id = req.user.userId;
    const sender_id = parseInt(req.params.senderId);

    await prisma.message.updateMany({
      where: { sender_id, receiver_id, is_read: false },
      data: { is_read: true },
    });

    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ success: false, error: 'Failed to update message status' });
  }
});

module.exports = router;
