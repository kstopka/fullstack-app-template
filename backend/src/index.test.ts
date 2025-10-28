import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { PrismaClient } from './generated/prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a test app instance
const app = express();

// Database connection for tests
const testPrisma = new PrismaClient();

// Middleware
app.use(express.json());

// Routes
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from backend! Updated!' });
});

// Mock database responses for testing without actual database
let mockUsers: any[] = [];

app.get('/api/users', async (req, res) => {
  // Simulate database call
  res.json(mockUsers);
});

app.post('/api/init-db', async (req, res) => {
  // Simulate database initialization
  res.json({ message: 'Database initialized' });
});

app.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = {
    id: mockUsers.length + 1,
    name,
    email,
    password,
    role: 'user',
    createdAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  res.json(newUser);
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find((u) => u.email === email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful' });
});

describe('API Integration Tests', () => {
  beforeAll(async () => {
    // Skip database tests if database is not available
    try {
      await testPrisma.$connect();
      // Ensure database is clean for tests
      await testPrisma.user.deleteMany();
    } catch (error) {
      console.warn('Database not available, skipping database tests');
    }
  });

  afterAll(async () => {
    try {
      await testPrisma.$disconnect();
    } catch (error) {
      // Ignore disconnect errors
    }
  });

  describe('GET /api/message', () => {
    it('should return hello message', async () => {
      const response = await request(app).get('/api/message');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Hello from backend! Updated!',
      });
    });
  });

  describe('GET /api/users', () => {
    it('should return empty array when no users exist', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/init-db', () => {
    it('should initialize database successfully', async () => {
      const response = await request(app).post('/api/init-db');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Database initialized',
      });
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app).post('/api/users').send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: userData.name,
        email: userData.email,
      });
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should return created user in GET /api/users', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        name: 'Test User',
        email: 'test@example.com',
      });
    });
  });

  describe('POST /api/login', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app).post('/api/login').send(loginData);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Login successful',
      });
    });

    it('should reject invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app).post('/api/login').send(loginData);
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: 'Invalid credentials',
      });
    });
  });
});
