const Appointment = require('../models/appointment');
const {
  buildRecentActivity,
  buildScheduleBlocks,
  buildStats,
  formatAppointment,
  getDoctorAppointments,
} = require('../utils/doctorDashboardHelpers');

const DoctorDashboardController = {
  async getSummary(req, res) {
    try {
      const { search = '' } = req.query;
      const today = new Date().toISOString().slice(0, 10);

      const { appointments: todayAppointments, diagnoses } = await getDoctorAppointments(
        req.doctor._id,
        { date: today, search }
      );

      const { appointments: upcomingOnly } = await getDoctorAppointments(req.doctor._id, {
        afterDate: today,
        search,
      });

      const todayRaw = await Appointment.find({
        doctorId: req.doctor._id,
        date: today,
      }).sort({ time: 1 });

      return res.json({
        stats: buildStats(todayAppointments, upcomingOnly.length),
        todayAppointments,
        scheduleBlocks: buildScheduleBlocks(todayRaw),
        upcomingPatients: upcomingOnly.slice(0, 5).map((appointment) => ({
          id: appointment.id,
          patientName: appointment.patientName,
          date: appointment.date,
          time: appointment.time,
          type: appointment.type,
          status: appointment.status,
          avatar: appointment.avatar,
        })),
        recentActivity: buildRecentActivity(todayAppointments, diagnoses),
      });
    } catch (error) {
      console.error('Error fetching doctor dashboard summary:', error);
      return res.status(500).json({ message: 'Error fetching doctor dashboard summary.' });
    }
  },

  async getAppointments(req, res) {
    try {
      const { date, search = '' } = req.query;
      const { appointments } = await getDoctorAppointments(req.doctor._id, { date, search });

      return res.json({ appointments });
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      return res.status(500).json({ message: 'Error fetching doctor appointments.' });
    }
  },

  async getSchedule(req, res) {
    try {
      const date = req.query.date || new Date().toISOString().slice(0, 10);
      const appointments = await Appointment.find({
        doctorId: req.doctor._id,
        date,
      }).sort({ time: 1 });

      return res.json({
        date,
        scheduleBlocks: buildScheduleBlocks(appointments),
      });
    } catch (error) {
      console.error('Error fetching doctor schedule:', error);
      return res.status(500).json({ message: 'Error fetching doctor schedule.' });
    }
  },

  async getPatients(req, res) {
    try {
      const { search = '' } = req.query;
      const { appointments } = await getDoctorAppointments(req.doctor._id, { search });

      const patientsMap = new Map();
      appointments.forEach((appointment) => {
        const key = `${appointment.patientName}-${appointment.phone || ''}`;
        if (!patientsMap.has(key)) {
          patientsMap.set(key, {
            id: key,
            patientName: appointment.patientName,
            age: appointment.age,
            phone: appointment.phone,
            lastVisit: appointment.date,
            avatar: appointment.avatar,
          });
        }
      });

      return res.json({ patients: Array.from(patientsMap.values()) });
    } catch (error) {
      console.error('Error fetching doctor patients:', error);
      return res.status(500).json({ message: 'Error fetching doctor patients.' });
    }
  },

  async updateVisitStatus(req, res) {
    try {
      const { visitStatus } = req.body;
      const allowedStatuses = ['scheduled', 'waiting', 'in_progress', 'completed'];

      if (!allowedStatuses.includes(visitStatus)) {
        return res.status(400).json({ message: 'Invalid visit status.' });
      }

      const appointment = await Appointment.findOne({
        _id: req.params.appointmentId,
        doctorId: req.doctor._id,
        status: { $ne: 'cancelled' },
      }).populate('departmentId', 'departmentName');

      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found.' });
      }

      appointment.visitStatus = visitStatus;
      await appointment.save();

      return res.json({
        message: 'Appointment status updated.',
        appointment: formatAppointment(appointment),
      });
    } catch (error) {
      console.error('Error updating visit status:', error);
      return res.status(500).json({ message: 'Error updating appointment status.' });
    }
  },
};

module.exports = DoctorDashboardController;
