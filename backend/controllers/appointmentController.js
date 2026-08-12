const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const Department = require('../models/department');
const qr = require('qrcode');
const cipher = require('../utils/cipher');

const formatAppointmentRow = (appointment) => ({
  date: appointment.date,
  time: appointment.time,
  patientName: `${appointment.firstName} ${appointment.lastName}`,
  doctorName: `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`,
  departmentName: appointment.departmentId.departmentName,
});

function splitFullName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || firstName;
  return { firstName, lastName };
}

function normalizeTime(time) {
  if (!time) return time;
  return time.length === 5 ? `${time}:00` : time;
}

function formatTimeToHHmm(time) {
  if (!time) return '';
  return time.slice(0, 5);
}

const START_HOUR = 9;
const END_HOUR = 17;

function generateBusinessSlots() {
  const slots = [];

  for (let hour = START_HOUR; hour <= END_HOUR; hour += 1) {
    const minutes = hour === END_HOUR ? [0] : [0, 15, 30, 45];

    for (const minute of minutes) {
      slots.push(
        `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
      );
    }
  }

  return slots;
}

function getAvailableSlotsForDoctor(bookedTimes) {
  const booked = new Set(bookedTimes.map(formatTimeToHHmm));
  return generateBusinessSlots().filter((slot) => !booked.has(slot));
}

const AppointmentController = {
  async appointmentPage(req, res) {
    res.render('appointments/appointment');
  },

  async getDailyAppointmentByDoctorId(req, res) {
    const { doctorId, date } = req.params;

    try {
      const appointments = await Appointment.find({ doctorId, date }).select('_id time');
      res.json(
        appointments.map((appointment) => ({
          appointmentId: appointment._id.toString(),
          time: appointment.time,
        }))
      );
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Error fetching appointments' });
    }
  },

  async getAvailableSlots(req, res) {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ message: 'doctorId and date are required.' });
    }

    try {
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found.' });
      }

      const appointments = await Appointment.find({ doctorId, date }).select('time');
      const slots = getAvailableSlotsForDoctor(appointments.map((appointment) => appointment.time));

      res.json({ slots });
    } catch (error) {
      console.error('Error fetching available slots:', error);
      res.status(500).json({ message: 'Error fetching available slots.' });
    }
  },

  async createAppointment(req, res, next) {
    let { doctorId, date, time, firstName, lastName, ssn, departmentId } = req.body;

    try {
      ssn = cipher.encryptSSN(ssn);
      req.body.ssn = ssn;

      await Appointment.create({
        doctorId,
        date,
        time: normalizeTime(time),
        firstName,
        lastName,
        ssn,
        departmentId,
      });

      next();
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: 'This time slot is already booked' });
      }
      console.error('Error creating appointment:', error);
      res.status(500).json({ message: 'Error creating appointment' });
    }
  },

  async createAppointmentApi(req, res) {
    const { fullName, phone, date, time, departmentId, doctorId } = req.body;

    if (
      !fullName?.trim() ||
      !phone?.trim() ||
      !date ||
      !time ||
      !departmentId ||
      !doctorId
    ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
      const department = await Department.findById(departmentId);
      if (!department) {
        return res.status(404).json({ message: 'Department not found.' });
      }

      const doctor = await Doctor.findOne({ _id: doctorId, departmentId: department._id });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found in this department.' });
      }

      const normalizedTime = normalizeTime(time);
      const availableSlots = getAvailableSlotsForDoctor(
        (await Appointment.find({ doctorId: doctor._id, date }).select('time')).map(
          (appointment) => appointment.time
        )
      );

      if (!availableSlots.includes(formatTimeToHHmm(normalizedTime))) {
        return res.status(409).json({ message: 'This time slot is no longer available.' });
      }

      const { firstName, lastName } = splitFullName(fullName);
      const encryptedPhone = cipher.encryptSSN(phone.trim());

      const appointment = await Appointment.create({
        userId: req.user?._id || null,
        firstName,
        lastName,
        phone: phone.trim(),
        ssn: encryptedPhone,
        departmentId: department._id,
        doctorId: doctor._id,
        date,
        time: normalizedTime,
      });

      const qrCode = await AppointmentController.generateQRCode(appointment._id.toString());

      res.status(201).json({
        message: 'Appointment booked successfully.',
        appointment: {
          appointmentId: appointment._id.toString(),
          date: appointment.date,
          time: formatTimeToHHmm(appointment.time),
          firstName: appointment.firstName,
          lastName: appointment.lastName,
          phone: appointment.phone,
          doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
          departmentName: department.departmentName,
          qrcode: qrCode,
        },
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: 'This time slot is already booked.' });
      }
      console.error('Error creating appointment via API:', error);
      res.status(500).json({ message: 'Error creating appointment.' });
    }
  },

  async generateQRCode(id) {
    try {
      return await qr.toDataURL(id);
    } catch (error) {
      console.log('Error generating QR code:', error);
      throw new Error('Error generating QR code');
    }
  },

  async appointmentInfoPage(req, res) {
    const { ssn, departmentId } = req.body;

    if (!ssn) {
      return res.status(400).json({ message: 'SSN is required' });
    }

    try {
      const encryptedSSN = req.body.ssn;
      const appointment = await Appointment.findOne({ ssn: encryptedSSN, departmentId })
        .populate('doctorId', 'firstName lastName')
        .populate('departmentId', 'departmentName')
        .sort({ _id: -1 });

      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found for the provided SSN' });
      }

      const qrCode = await AppointmentController.generateQRCode(appointment._id.toString());

      const appointmentDetails = {
        appointmentId: appointment._id.toString(),
        date: appointment.date,
        time: appointment.time,
        doctorName: `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`,
        departmentName: appointment.departmentId.departmentName,
        qrcode: qrCode,
      };

      res.render('appointments/appointment-ticket', { appointment: appointmentDetails });
    } catch (error) {
      console.error('Error fetching appointment details by SSN:', error);
      res.status(500).json({ message: 'Error fetching appointment details by SSN' });
    }
  },

  async appointmentTable(req, res) {
    try {
      const appointments = await Appointment.find()
        .populate('doctorId', 'firstName lastName')
        .populate('departmentId', 'departmentName')
        .sort({ date: 1, time: 1 });

      res.render('appointments/appointment-table', {
        appointments: appointments.map(formatAppointmentRow),
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  async appointmentTableId(req, res) {
    const departmentName = req.params.departmentName;

    try {
      const department = await Department.findOne({ departmentName });
      if (!department) {
        return res.render('appointments/appointment-table', { appointments: [] });
      }

      const appointments = await Appointment.find({ departmentId: department._id })
        .populate('doctorId', 'firstName lastName')
        .populate('departmentId', 'departmentName')
        .sort({ date: 1, time: 1 });

      res.render('appointments/appointment-table', {
        appointments: appointments.map(formatAppointmentRow),
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).send('Internal Server Error');
    }
  },
};

module.exports = AppointmentController;
