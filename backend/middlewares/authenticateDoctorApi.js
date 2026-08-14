const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctor');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const DOCTOR_AUTH_COOKIE = 'doctorToken';

const authenticateDoctorApi = async (req, res, next) => {
  try {
    const token = req.signedCookies[DOCTOR_AUTH_COOKIE];

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid or expired session.' });
      }

      const doctor = await Doctor.findById(decoded.doctorId).populate(
        'departmentId',
        'departmentName'
      );

      if (!doctor) {
        return res.status(401).json({ message: 'Doctor not found.' });
      }

      req.doctor = doctor;
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = authenticateDoctorApi;
