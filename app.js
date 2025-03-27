const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const genericRoutes = require('./routes/generic');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || []
}));
app.use(express.json());

// Rate Limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Health Check
app.get('/api/health', async (req, res) => {
  try {
    // Verify database connection
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();

    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected'
    });
  } catch (err) {
    res.status(503).json({
      status: 'Service Unavailable',
      error: err.message,
      database: 'disconnected'
    });
  }
});

// API Routes
app.use('/api', genericRoutes);

// Enhanced Error Handling
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const response = {
    error: err.message || 'Internal Server Error'
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack.split('\n');
    response.details = {
      method: req.method,
      path: req.path,
      timestamp: new Date().toISOString()
    };
  }

  logger.error(`${status} - ${req.method} ${req.originalUrl} - ${err.message}`);

  res.status(status).json(response);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Generic API running on port ${PORT}`);
});
