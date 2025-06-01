const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Отримати всі події
router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
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
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Отримати подію за ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
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
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Створити подію (потребує авторизації)
router.post('/', authenticateToken, [
  body('title').notEmpty().withMessage('Title is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('location').notEmpty().withMessage('Location is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, date, location, maxParticipants, imageUrl } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        imageUrl,
        creatorId: req.user.id
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { registrations: true }
        }
      }
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Оновити подію (тільки створювач)
router.put('/:id', authenticateToken, [
  body('title').notEmpty().withMessage('Title is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('location').notEmpty().withMessage('Location is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, date, location, maxParticipants, imageUrl } = req.body;

    // Перевіряємо чи подія існує і чи користувач є її створювачем
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (existingEvent.creatorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this event' });
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date),
        location,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        imageUrl
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { registrations: true }
        }
      }
    });

    res.json(event);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Видалити подію (тільки створювач)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Перевіряємо чи подія існує і чи користувач є її створювачем
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (existingEvent.creatorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }

    await prisma.event.delete({
      where: { id }
    });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Зареєструватися на подію
router.post('/:id/register', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Перевіряємо чи подія існує
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: { registrations: true }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Перевіряємо чи є місця (якщо обмеження встановлене)
    if (event.maxParticipants && event._count.registrations >= event.maxParticipants) {
      return res.status(400).json({ error: 'Event is full' });
    }

    // Перевіряємо чи користувач вже зареєстрований
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId: req.user.id,
          eventId: id
        }
      }
    });

    if (existingRegistration) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    // Створюємо реєстрацію
    const registration = await prisma.eventRegistration.create({
      data: {
        userId: req.user.id,
        eventId: id
      },
      include: {
        event: {
          select: { title: true, date: true, location: true }
        }
      }
    });

    res.status(201).json({
      message: 'Successfully registered for event',
      registration
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/registration-status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId: req.user.id,
          eventId: id
        }
      }
    });

    res.json({ registered: !!existingRegistration });
  } catch (error) {
    console.error('Check registration status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Скасувати реєстрацію на подію
router.delete('/:id/register', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Знаходимо і видаляємо реєстрацію
    const registration = await prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId: req.user.id,
          eventId: id
        }
      }
    });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    await prisma.eventRegistration.delete({
      where: {
        userId_eventId: {
          userId: req.user.id,
          eventId: id
        }
      }
    });

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;