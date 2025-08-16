const rateLimit = require('express-rate-limit');
const config = require('./../config/development.json');

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs || 15 * 60 * 1000, // 15 minutes
  max: config.rateLimit.max || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = limiter;