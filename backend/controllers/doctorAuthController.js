const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctor');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const DOCTOR_AUTH_COOKIE = 'doctorToken';
const REMEMBER_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const SESSION_MAX_AGE = 60 * 60 * 1000;

const DOCTOR_COOKIE_OPTIONS = {
  signed: true,
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
};

function sanitizeDoctor(doctor) {
  return {
    doctorId: doctor._id.toString(),
    firstName: doctor.firstName,
    lastName: doctor.lastName,
    fullName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
    email: doctor.email,
    specialty: doctor.departmentId?.departmentName || 'General Medicine',
  };
}

function setDoctorAuthCookie(res, doctorId, remember = false) {
  const maxAge = remember ? REMEMBER_MAX_AGE : SESSION_MAX_AGE;
  const expiresIn = remember ? '7d' : '1h';
  const token = jwt.sign({ doctorId }, JWT_SECRET, { expiresIn });

  res.cookie(DOCTOR_AUTH_COOKIE, token, {
    ...DOCTOR_COOKIE_OPTIONS,
    maxAge,
  });
}

const DoctorAuthController = {
  async login(req, res) {
    try {
      const { email, password, remember = false } = req.body;

      if (!email?.trim() || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const doctor = await Doctor.findOne({ email: email.trim().toLowerCase() }).populate(
        'departmentId',
        'departmentName'
      );

      if (!doctor || !bcrypt.compareSync(password, doctor.password)) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      setDoctorAuthCookie(res, doctor._id.toString(), Boolean(remember));

      return res.json({
        message: 'Doctor login successful',
        doctor: sanitizeDoctor(doctor),
      });
    } catch (error) {
      return res.status(500).json({ message: error.message || 'Login failed.' });
    }
  },

  async logout(_req, res) {
    res.clearCookie(DOCTOR_AUTH_COOKIE, DOCTOR_COOKIE_OPTIONS);
    return res.json({ message: 'Logged out successfully.' });
  },

  async getCurrentDoctor(req, res) {
    return res.json({ doctor: sanitizeDoctor(req.doctor) });
  },
};

module.exports = DoctorAuthController;
