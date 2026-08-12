const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctor');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

const authenticate = async (req, res, next) => {
  try {
    const token = req.signedCookies.token;

    if (!token) {
      return res.redirect('/doctors/login');
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.redirect('/doctors/login');
      }

      const doctor = await Doctor.findById(decoded.doctorId);
      if (!doctor) {
        return res.redirect('/doctors/login');
      }

      req.doctor = doctor;
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = authenticate;
