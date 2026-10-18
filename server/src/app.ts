import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import authRoutes from './routes/auth.routes';
import paintingRoutes from './routes/painting.routes';
import orderRoutes from './routes/order.routes';
import bookingRoutes from './routes/booking.routes';
import potteryRoutes from './routes/pottery.routes';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

const clientOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Static file serving for painting and studio images
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/paintings', paintingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/pottery', potteryRoutes);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Centralized error handling
app.use(errorHandler);
