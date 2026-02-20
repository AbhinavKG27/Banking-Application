const jwt = require('jsonwebtoken');
const { getTokenRecord } = require('../models/tokenModel');

const verifyAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.kodbank_token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: token missing.' });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired. Please login again.' });
      }
      return res.status(401).json({ message: 'Invalid token signature.' });
    }

    const tokenRecord = await getTokenRecord(token);
    if (!tokenRecord) {
      return res.status(401).json({ message: 'Token not recognized.' });
    }

    const now = new Date();
    if (new Date(tokenRecord.expiry) < now) {
      return res.status(401).json({ message: 'Token expired in database. Please login again.' });
    }

    req.user = {
      username: payload.sub,
      role: payload.role,
    };

    return next();
  } catch (error) {
    return res.status(500).json({ message: 'Authentication failed.', error: error.message });
  }
};

module.exports = verifyAuth;
