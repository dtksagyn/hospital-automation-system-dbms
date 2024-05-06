const jwt = require('jsonwebtoken');
const  Doctor  = require('../models/doctor');

// Middleware function to check authentication
const authenticate = async (req, res, next) => {
  try {
    // Get token from signed cookie
    const token = req.signedCookies.token;

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Verify token
    jwt.verify(token, 'secretkey', async (err, decoded) => {
      if (err) {
        return res.status(401).redirect('/doctors/login')
      } else {
        // Token is valid, attach doctor's information to request object
        const { doctorId, email } = decoded;
        const doctor = await Doctor.findOne({ where: { doctorId} });
        if (!doctor) {
          return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        req.doctor = doctor; // Attach doctor's information to request object
        next(); // Call the next middleware
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = authenticate;
