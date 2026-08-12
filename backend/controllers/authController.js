const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

const AUTH_COOKIE = 'userToken';
const REMEMBER_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const SESSION_MAX_AGE = 60 * 60 * 1000;

function sanitizeUser(user) {
  return {
    userId: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
  };
}

function setAuthCookie(res, userId, remember = false) {
  const maxAge = remember ? REMEMBER_MAX_AGE : SESSION_MAX_AGE;
  const expiresIn = remember ? '7d' : '1h';

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn });

  res.cookie(AUTH_COOKIE, token, {
    signed: true,
    httpOnly: true,
    maxAge,
    sameSite: 'lax',
  });
}

const AuthController = {
  async register(req, res) {
    try {
      const { fullName, email, password } = req.body;

      if (!fullName?.trim() || !email?.trim() || !password) {
        return res.status(400).json({ message: 'Full name, email, and password are required.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await User.findOne({ email: normalizedEmail });

      if (existingUser) {
        return res.status(409).json({ message: 'An account with this email already exists.' });
      }

      const hashedPassword = bcrypt.hashSync(password, 12);
      const user = await User.create({
        fullName: fullName.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      });

      setAuthCookie(res, user._id.toString(), true);

      return res.status(201).json({
        message: 'Account created successfully.',
        user: sanitizeUser(user),
      });
    } catch (error) {
      return res.status(500).json({ message: error.message || 'Registration failed.' });
    }
  },

  async login(req, res) {
    try {
      const { email, password, remember = false } = req.body;

      if (!email?.trim() || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const user = await User.findOne({ email: email.trim().toLowerCase() });

      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      setAuthCookie(res, user._id.toString(), Boolean(remember));

      return res.json({
        message: 'Signed in successfully.',
        user: sanitizeUser(user),
      });
    } catch (error) {
      return res.status(500).json({ message: error.message || 'Login failed.' });
    }
  },

  async logout(_req, res) {
    res.clearCookie(AUTH_COOKIE, { signed: true, httpOnly: true, sameSite: 'lax' });
    return res.json({ message: 'Logged out successfully.' });
  },

  async getCurrentUser(req, res) {
    return res.json({ user: sanitizeUser(req.user) });
  },
};

module.exports = AuthController;
