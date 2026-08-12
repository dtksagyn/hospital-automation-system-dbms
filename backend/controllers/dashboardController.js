const Appointment = require('../models/appointment');
const Diagnosis = require('../models/diagnosis');

const HOSPITAL_LOCATION = 'CareMed Hospital, Main Campus';

function formatTimeToDisplay(time) {
  if (!time) return '';

  const [hourPart, minutePart = '00'] = time.split(':');
  let hour = Number.parseInt(hourPart, 10);
  const minute = minutePart.slice(0, 2);
  const period = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12 || 12;

  return `${hour}:${minute} ${period}`;
}

function formatDisplayDate(dateValue) {
  const [year, month, day] = dateValue.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function resolveAppointmentStatus(appointment, hasDiagnosis) {
  if (appointment.status === 'cancelled') {
    return 'Cancelled';
  }

  const today = new Date().toISOString().slice(0, 10);

  if (appointment.date < today || hasDiagnosis) {
    return 'Completed';
  }

  if (appointment.date === today) {
    return 'Pending';
  }

  return 'Scheduled';
}

function formatAppointment(appointment, diagnosisIds) {
  const hasDiagnosis = diagnosisIds.has(appointment._id.toString());

  return {
    id: appointment._id.toString(),
    appointmentId: appointment._id.toString(),
    date: formatDisplayDate(appointment.date),
    rawDate: appointment.date,
    time: formatTimeToDisplay(appointment.time),
    doctor: `Dr. ${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`,
    doctorName: `Dr. ${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`,
    specialty: appointment.departmentId.departmentName,
    department: appointment.departmentId.departmentName,
    type: 'Consultation',
    location: HOSPITAL_LOCATION,
    status: resolveAppointmentStatus(appointment, hasDiagnosis),
    avatar: '/images/doctor-hero.png',
    phone: appointment.phone,
  };
}

async function getUserAppointments(userId) {
  return Appointment.find({ userId })
    .populate('doctorId', 'firstName lastName')
    .populate('departmentId', 'departmentName')
    .sort({ date: -1, time: -1 });
}

async function getDiagnosisIds(appointmentIds) {
  if (appointmentIds.length === 0) {
    return new Set();
  }

  const diagnoses = await Diagnosis.find({
    appointmentId: { $in: appointmentIds },
  }).select('appointmentId');

  return new Set(diagnoses.map((diagnosis) => diagnosis.appointmentId.toString()));
}

function buildStats(formattedAppointments, prescriptionCount) {
  const upcomingAppointments = formattedAppointments.filter(
    (appointment) => ['Scheduled', 'Pending'].includes(appointment.status)
  ).length;

  const completedVisits = formattedAppointments.filter(
    (appointment) => appointment.status === 'Completed'
  ).length;

  return {
    upcomingAppointments,
    completedVisits,
    prescriptions: prescriptionCount,
    medicalRecords: prescriptionCount,
  };
}

const DashboardController = {
  async getSummary(req, res) {
    try {
      const appointments = await getUserAppointments(req.user._id);
      const appointmentIds = appointments.map((appointment) => appointment._id);
      const diagnosisIds = await getDiagnosisIds(appointmentIds);
      const formattedAppointments = appointments.map((appointment) =>
        formatAppointment(appointment, diagnosisIds)
      );

      const upcomingAppointment =
        formattedAppointments
          .filter((appointment) => ['Scheduled', 'Pending'].includes(appointment.status))
          .sort((a, b) => `${a.rawDate}${a.time}`.localeCompare(`${b.rawDate}${b.time}`))[0] ||
        null;

      const stats = buildStats(formattedAppointments, diagnosisIds.size);

      return res.json({
        stats,
        upcomingAppointment,
        recentAppointments: formattedAppointments.slice(0, 8),
      });
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      return res.status(500).json({ message: 'Error fetching dashboard summary.' });
    }
  },

  async getAppointments(req, res) {
    try {
      const appointments = await getUserAppointments(req.user._id);
      const appointmentIds = appointments.map((appointment) => appointment._id);
      const diagnosisIds = await getDiagnosisIds(appointmentIds);

      return res.json({
        appointments: appointments.map((appointment) =>
          formatAppointment(appointment, diagnosisIds)
        ),
      });
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      return res.status(500).json({ message: 'Error fetching appointments.' });
    }
  },

  async cancelAppointment(req, res) {
    try {
      const appointment = await Appointment.findOne({
        _id: req.params.appointmentId,
        userId: req.user._id,
      });

      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found.' });
      }

      if (appointment.status === 'cancelled') {
        return res.status(400).json({ message: 'Appointment is already cancelled.' });
      }

      const today = new Date().toISOString().slice(0, 10);
      if (appointment.date < today) {
        return res.status(400).json({ message: 'Past appointments cannot be cancelled.' });
      }

      appointment.status = 'cancelled';
      await appointment.save();

      return res.json({ message: 'Appointment cancelled successfully.' });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      return res.status(500).json({ message: 'Error cancelling appointment.' });
    }
  },
};

module.exports = DashboardController;
