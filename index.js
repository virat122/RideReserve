const express = require('express');
const compression = require('compression');
const config = require('./config/development.json');
const { prefix } = config.api;
const limiter = require('./utils/rateLimiter')
const app = express();

const authRoutes = require('./routes/auth/auth')


app.use(limiter);
app.use(compression()); // Compression middleware
app.use(express.json({ limit: '10mb' })); // Body parsing middleware




//API routes
app.use(`${prefix}/auth`, authRoutes);



// app.use('/check', (req, res) => {
//   res.status(200).json({   
//     message: `Application is working`
//   });
// });


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Duplicate entry error (MySQL error code 1062)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'Resource already exists',
      message: 'Duplicate entry detected'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: config.app.environment === 'development' ? err.message : 'Internal Server Error',
    ...(config.app.environment === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});



// Start server
const PORT = config.app.port || 3000;
const HOST = config.app.host || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Ride Reserve API running on http://${HOST}:${PORT}`);
  console.log(`📊 Environment: ${config.app.environment}`);
  console.log(`🔧 Mode: ${config.app.mode}`);
});

module.exports = app;