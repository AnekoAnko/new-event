const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Отримати профіль поточного користувача
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Отримати події створені користувачем
router.get('/my-events', authenticateToken, async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { creatorId: req.user.id },
      include: {
        registrations: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        _count: {
          select: { registrations: true }
        }
      },
      orderBy: { date: 'asc' }
    });

    res.json(events);
  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Отримати події на які зареєстрований користувач
router.get('/my-registrations', authenticateToken, async (req, res) => {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      where: { userId: req.user.id },
      include: {
        event: {
          include: {
            creator: {
              select: { id: true, name: true, email: true }
            },
            _count: {
              select: { registrations: true }
            }
          }
        }
      },
      orderBy: { event: { date: 'asc' } }
    });

    res.json(registrations.map(reg => reg.event));
  } catch (error) {
    console.error('Get my registrations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;