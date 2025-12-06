const rateLimit = require('express-rate-limit');

// Rate limiter for match creation endpoint
const createMatchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 matches per minute per IP
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// WebSocket message rate limiting
const wsMessageLimiter = new Map();

const checkWsRateLimit = (userId, limit = 30, windowMs = 1000) => {
  const now = Date.now();
  const userHistory = wsMessageLimiter.get(userId) || [];
  
  // Remove old entries
  const recentMessages = userHistory.filter(time => now - time < windowMs);
  
  if (recentMessages.length >= limit) {
    return false; // Rate limited
  }
  
  recentMessages.push(now);
  wsMessageLimiter.set(userId, recentMessages);
  return true;
};

// Cleanup stale rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [userId, times] of wsMessageLimiter.entries()) {
    const recentTimes = times.filter(time => now - time < 60000);
    if (recentTimes.length === 0) {
      wsMessageLimiter.delete(userId);
    } else {
      wsMessageLimiter.set(userId, recentTimes);
    }
  }
}, 60000);

module.exports = { createMatchLimiter, checkWsRateLimit };
