const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const AUTH_COOKIE = 'userToken';

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.signedCookies[AUTH_COOKIE];

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid or expired session.' });
      }

      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ message: 'User not found.' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = authenticateUser;
