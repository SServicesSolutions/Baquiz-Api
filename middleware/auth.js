const jwt = require('jsonwebtoken');
const { ForbiddenError } = require('../utils/errors');

const rolePermissions = {
  admin: ['*'],
  user: ['SELECT', 'INSERT'],
  guest: ['SELECT']
};

exports.authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next(new ForbiddenError('Authentication required'));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(new ForbiddenError('Invalid token'));
    req.user = user;
    next();
  });
};

exports.validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return next(new ForbiddenError('Invalid API key'));
  }
  next();
};

// Add role-based access control
exports.checkPermissions = (requiredPermission) => (req, res, next) => {
  const userRole = req.user?.role || 'guest';
  const allowedActions = rolePermissions[userRole];

  if (!allowedActions?.includes(requiredPermission) && !allowedActions?.includes('*')) {
    return next(new ForbiddenError('Insufficient permissions'));
  }

  next();
};
