const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const AUTH_COOKIE = 'userToken';

const optionalAuthenticateUser = async (req, _res, next) => {
  try {
    const token = req.signedCookies[AUTH_COOKIE];

    if (!token) {
      return next();
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return next();
      }

      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = user;
      }

      next();
    });
  } catch (error) {
    console.error(error);
    next();
  }
};

module.exports = optionalAuthenticateUser;
