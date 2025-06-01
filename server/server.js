const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { exec } = require('child_process');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

async function checkAndApplySchema() {
  try {
    // Спроба знайти перший запис у таблиці users, щоб перевірити її наявність
    await prisma.users.findFirst();
    console.log('Таблиця users існує.');
  } catch (error) {
    console.log('Таблиці users не існує. Запускаємо prisma db push...');
    // Якщо таблиці немає — виконуємо prisma db push
    exec('npx prisma db push', (err, stdout, stderr) => {
      if (err) {
        console.error('Помилка при застосуванні схеми Prisma:', err);
        process.exit(1);
      }
      console.log(stdout);
      console.error(stderr);
      console.log('Схема Prisma застосована успішно.');
    });
  }
}

async function startServer() {
  await checkAndApplySchema();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/users', userRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!' });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
