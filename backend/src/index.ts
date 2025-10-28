import express from 'express';
import { PrismaClient } from './generated/prisma/client';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { authMiddleware } from './middleware/authMiddleware';
import { generateToken } from './utils/jwt';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Database connection
const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(morgan('dev'));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from backend! Updated!' });
});

// Login endpoint to generate JWT
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken({ userId: user.id, role: user.role });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Protected route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Simple database endpoint to test connection
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create users table if it doesn't exist (now handled by Prisma migration)
app.post('/api/init-db', async (req, res) => {
  try {
    // Migration already created the table, just return success
    res.json({ message: 'Database initialized' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to initialize database' });
  }
});

// Create a new user
app.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email, password },
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
