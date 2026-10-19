import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Health check route, used to test that the API and database are running
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TutorMatch API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Error handling (must come after all routes)
app.use(notFound);
app.use(errorHandler);

export default app;
