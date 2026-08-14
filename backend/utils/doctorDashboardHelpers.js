const Appointment = require('../models/appointment');
const Diagnosis = require('../models/diagnosis');

const SCHEDULE_BLOCKS = [
  { id: 'block-1', label: '09:00 AM – 10:00 AM', startHour: 9 },
  { id: 'block-2', label: '10:00 AM – 11:00 AM', startHour: 10 },
  { id: 'block-3', label: '11:00 AM – 12:00 PM', startHour: 11 },
  { id: 'block-4', label: '12:00 PM – 01:00 PM', startHour: 12, isBreak: true },
  { id: 'block-5', label: '01:00 PM – 02:00 PM', startHour: 13 },
  { id: 'block-6', label: '02:00 PM – 03:00 PM', startHour: 14 },
  { id: 'block-7', label: '03:00 PM – 04:00 PM', startHour: 15 },
];

const VISIT_STATUS_LABELS = {
  scheduled: 'Scheduled',
  waiting: 'Waiting',
  in_progress: 'In Progress',
  completed: 'Completed',
};

function formatTimeToDisplay(time) {
  if (!time) return '';

  const [hourPart, minutePart = '00'] = time.split(':');
  let hour = Number.parseInt(hourPart, 10);
  const minute = minutePart.slice(0, 2);
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;

  return `${hour}:${minute} ${period}`;
}

function resolveDisplayStatus(appointment, hasDiagnosis) {
  if (appointment.status === 'cancelled') {
    return 'Cancelled';
  }

  if (hasDiagnosis || appointment.visitStatus === 'completed') {
    return 'Completed';
  }

  return VISIT_STATUS_LABELS[appointment.visitStatus] || 'Scheduled';
}

function formatAppointment(appointment, hasDiagnosis = false) {
  const patientName = `${appointment.firstName} ${appointment.lastName}`;

  return {
    id: appointment._id.toString(),
    appointmentId: appointment._id.toString(),
    patientName,
    age: appointment.patientAge ?? null,
    date: appointment.date,
    time: formatTimeToDisplay(appointment.time),
    rawTime: appointment.time.slice(0, 5),
    type: appointment.appointmentType || 'Consultation',
    reason: appointment.reason || 'Scheduled visit',
    status: resolveDisplayStatus(appointment, hasDiagnosis),
    visitStatus: appointment.visitStatus,
    avatar: '/images/doctor-hero.png',
    phone: appointment.phone,
    department: appointment.departmentId?.departmentName || '',
  };
}

function buildScheduleBlocks(appointments) {
  const bookedByTime = new Map(
    appointments.map((appointment) => [
      appointment.time.slice(0, 5),
      {
        patientName: `${appointment.firstName} ${appointment.lastName}`,
        visitStatus: appointment.visitStatus,
        status: appointment.status,
      },
    ])
  );

  return SCHEDULE_BLOCKS.map((block) => ({
    id: block.id,
    label: block.label,
    slots: [0, 15, 30, 45].map((minute) => {
      const hour = block.startHour;
      const timeKey = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const booking = bookedByTime.get(timeKey);

      if (block.isBreak) {
        return { id: `${block.id}-${minute}`, time: timeKey, status: 'Break' };
      }

      if (!booking) {
        return { id: `${block.id}-${minute}`, time: timeKey, status: 'Available' };
      }

      if (booking.status === 'cancelled') {
        return {
          id: `${block.id}-${minute}`,
          time: timeKey,
          status: 'Cancelled',
          patientName: booking.patientName,
        };
      }

      if (booking.visitStatus === 'completed') {
        return {
          id: `${block.id}-${minute}`,
          time: timeKey,
          status: 'Completed',
          patientName: booking.patientName,
        };
      }

      return {
        id: `${block.id}-${minute}`,
        time: timeKey,
        status: 'Booked',
        patientName: booking.patientName,
      };
    }),
  }));
}

function matchesSearch(item, search) {
  if (!search) return true;

  const haystack = Object.values(item)
    .filter((value) => typeof value === 'string' || typeof value === 'number')
    .join(' ')
    .toLowerCase();

  return haystack.includes(search);
}

async function getDiagnosisMap(appointmentIds) {
  if (appointmentIds.length === 0) {
    return [];
  }

  const diagnoses = await Diagnosis.find({
    appointmentId: { $in: appointmentIds },
  }).select('appointmentId description medication createdAt');

  return diagnoses;
}

async function getDoctorAppointments(doctorId, { date, afterDate, search, includeCancelled = false } = {}) {
  const query = { doctorId };

  if (date) {
    query.date = date;
  } else if (afterDate) {
    query.date = { $gt: afterDate };
  }

  if (!includeCancelled) {
    query.status = { $ne: 'cancelled' };
  }

  const appointments = await Appointment.find(query)
    .populate('departmentId', 'departmentName')
    .sort({ date: 1, time: 1 });

  const appointmentIds = appointments.map((appointment) => appointment._id);
  const diagnoses = await getDiagnosisMap(appointmentIds);
  const diagnosisIds = new Set(diagnoses.map((item) => item.appointmentId.toString()));

  const formatted = appointments.map((appointment) =>
    formatAppointment(appointment, diagnosisIds.has(appointment._id.toString()))
  );

  const normalizedSearch = search?.trim().toLowerCase();
  if (!normalizedSearch) {
    return { appointments: formatted, diagnoses };
  }

  return {
    appointments: formatted.filter((appointment) => matchesSearch(appointment, normalizedSearch)),
    diagnoses,
  };
}

function buildRecentActivity(appointments, diagnoses) {
  const activity = [];

  diagnoses.slice(0, 5).forEach((diagnosis) => {
    const appointment = appointments.find(
      (item) => item.id === diagnosis.appointmentId.toString()
    );

    activity.push({
      id: `diagnosis-${diagnosis._id.toString()}`,
      icon: 'bi-capsule',
      description: 'Prescription issued',
      patientName: appointment?.patientName || 'Patient',
      timestamp: 'Recently',
    });
  });

  appointments
    .filter((appointment) => appointment.status === 'Completed')
    .slice(0, 5)
    .forEach((appointment) => {
      activity.push({
        id: `completed-${appointment.id}`,
        icon: 'bi-check2-circle',
        description: 'Appointment completed',
        patientName: appointment.patientName,
        timestamp: `${appointment.time}`,
      });
    });

  appointments
    .filter((appointment) => appointment.visitStatus === 'waiting')
    .slice(0, 3)
    .forEach((appointment) => {
      activity.push({
        id: `checkin-${appointment.id}`,
        icon: 'bi-person-check',
        description: 'Patient checked in',
        patientName: appointment.patientName,
        timestamp: `${appointment.time}`,
      });
    });

  return activity.slice(0, 8);
}

function buildStats(todayAppointments, futureCount) {
  return {
    todayAppointments: todayAppointments.length,
    waitingPatients: todayAppointments.filter((appointment) => appointment.status === 'Waiting')
      .length,
    completedVisits: todayAppointments.filter((appointment) => appointment.status === 'Completed')
      .length,
    upcomingAppointments: futureCount,
  };
}

module.exports = {
  SCHEDULE_BLOCKS,
  formatAppointment,
  formatTimeToDisplay,
  buildScheduleBlocks,
  getDoctorAppointments,
  buildRecentActivity,
  buildStats,
  matchesSearch,
};
