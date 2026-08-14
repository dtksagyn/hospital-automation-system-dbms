export const DOCTOR_DASHBOARD_HOME = "/doctor/dashboard";

export const DOCTOR_DASHBOARD_NAV = [
  { label: "Dashboard", to: DOCTOR_DASHBOARD_HOME, icon: "bi-grid-1x2-fill" },
  { label: "Appointments", to: "/doctor/dashboard/appointments", icon: "bi-calendar-check" },
  { label: "Patients", to: "/doctor/dashboard/patients", icon: "bi-people" },
  { label: "Schedule", to: "/doctor/dashboard/schedule", icon: "bi-calendar3" },
  { label: "Medical Records", to: "/doctor/dashboard/medical-records", icon: "bi-file-earmark-medical" },
  { label: "Prescriptions", to: "/doctor/dashboard/prescriptions", icon: "bi-capsule" },
  { label: "Messages", to: "/doctor/dashboard/messages", icon: "bi-chat-dots" },
  { label: "Profile", to: "/doctor/dashboard/profile", icon: "bi-person-circle" },
  { label: "Settings", to: "/doctor/dashboard/settings", icon: "bi-gear" },
];

export const DOCTOR_QUICK_ACTIONS = [
  { label: "Add Patient", icon: "bi-person-plus", action: "add-patient" },
  { label: "Create Prescription", icon: "bi-capsule", to: "/doctor/dashboard/prescriptions" },
  { label: "View Medical Records", icon: "bi-file-earmark-medical", to: "/doctor/dashboard/medical-records" },
  { label: "Manage Schedule", icon: "bi-calendar3", to: "/doctor/dashboard/schedule" },
  { label: "View All Appointments", icon: "bi-calendar-check", to: "/doctor/dashboard/appointments" },
];

export function getDoctorGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getDoctorStatusClass(status) {
  switch (status) {
    case "Scheduled":
      return "dashboard-status dashboard-status--scheduled";
    case "Waiting":
      return "dashboard-status dashboard-status--waiting";
    case "In Progress":
      return "dashboard-status dashboard-status--in-progress";
    case "Completed":
      return "dashboard-status dashboard-status--completed";
    case "Cancelled":
      return "dashboard-status dashboard-status--cancelled";
    case "Pending":
      return "dashboard-status dashboard-status--pending";
    case "Available":
      return "doctor-slot doctor-slot--available";
    case "Booked":
      return "doctor-slot doctor-slot--booked";
    case "Break":
      return "doctor-slot doctor-slot--break";
    default:
      return "dashboard-status";
  }
}

export function formatAppointmentDate(dateString) {
  if (!dateString) return "—";

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const MOCK_DOCTOR_DASHBOARD = {
  stats: {
    todayAppointments: 8,
    waitingPatients: 2,
    completedVisits: 4,
    upcomingAppointments: 3,
  },
  todayAppointments: [
    {
      id: "1",
      patientName: "Michael Jones",
      age: 34,
      time: "09:00 AM",
      type: "Follow-up",
      reason: "Routine blood pressure review",
      status: "Completed",
      avatar: "/images/doctor-hero.png",
    },
    {
      id: "2",
      patientName: "Sarah Thompson",
      age: 41,
      time: "10:00 AM",
      type: "Consultation",
      reason: "Chest discomfort evaluation",
      status: "In Progress",
      avatar: "/images/doctor-hero.png",
    },
    {
      id: "3",
      patientName: "David Chen",
      age: 52,
      time: "11:00 AM",
      type: "Check-up",
      reason: "Annual cardiac screening",
      status: "Waiting",
      avatar: "/images/doctor-hero.png",
    },
    {
      id: "4",
      patientName: "Emily Rodriguez",
      age: 29,
      time: "01:00 PM",
      type: "Consultation",
      reason: "Post-surgery follow-up",
      status: "Scheduled",
      avatar: "/images/doctor-hero.png",
    },
    {
      id: "5",
      patientName: "James Wilson",
      age: 63,
      time: "02:30 PM",
      type: "Lab Review",
      reason: "Review ECG results",
      status: "Scheduled",
      avatar: "/images/doctor-hero.png",
    },
  ],
  scheduleBlocks: [
    {
      id: "block-1",
      label: "09:00 AM – 10:00 AM",
      slots: [
        { id: "s1", time: "09:00", status: "Completed", patientName: "Michael Jones" },
        { id: "s2", time: "09:15", status: "Completed", patientName: "Michael Jones" },
        { id: "s3", time: "09:30", status: "Available" },
        { id: "s4", time: "09:45", status: "Available" },
      ],
    },
    {
      id: "block-2",
      label: "10:00 AM – 11:00 AM",
      slots: [
        { id: "s5", time: "10:00", status: "Booked", patientName: "Sarah Thompson" },
        { id: "s6", time: "10:15", status: "Booked", patientName: "Sarah Thompson" },
        { id: "s7", time: "10:30", status: "Available" },
        { id: "s8", time: "10:45", status: "Available" },
      ],
    },
    {
      id: "block-3",
      label: "11:00 AM – 12:00 PM",
      slots: [
        { id: "s9", time: "11:00", status: "Booked", patientName: "David Chen" },
        { id: "s10", time: "11:15", status: "Available" },
        { id: "s11", time: "11:30", status: "Available" },
        { id: "s12", time: "11:45", status: "Available" },
      ],
    },
    {
      id: "block-4",
      label: "12:00 PM – 01:00 PM",
      slots: [
        { id: "s13", time: "12:00", status: "Break" },
        { id: "s14", time: "12:15", status: "Break" },
        { id: "s15", time: "12:30", status: "Break" },
        { id: "s16", time: "12:45", status: "Break" },
      ],
    },
    {
      id: "block-5",
      label: "01:00 PM – 02:00 PM",
      slots: [
        { id: "s17", time: "13:00", status: "Booked", patientName: "Emily Rodriguez" },
        { id: "s18", time: "13:15", status: "Available" },
        { id: "s19", time: "13:30", status: "Available" },
        { id: "s20", time: "13:45", status: "Available" },
      ],
    },
    {
      id: "block-6",
      label: "02:00 PM – 03:00 PM",
      slots: [
        { id: "s21", time: "14:00", status: "Available" },
        { id: "s22", time: "14:15", status: "Available" },
        { id: "s23", time: "14:30", status: "Booked", patientName: "James Wilson" },
        { id: "s24", time: "14:45", status: "Available" },
      ],
    },
    {
      id: "block-7",
      label: "03:00 PM – 04:00 PM",
      slots: [
        { id: "s25", time: "15:00", status: "Available" },
        { id: "s26", time: "15:15", status: "Available" },
        { id: "s27", time: "15:30", status: "Available" },
        { id: "s28", time: "15:45", status: "Available" },
      ],
    },
  ],
  upcomingPatients: [
    {
      id: "u1",
      patientName: "David Chen",
      time: "11:00 AM",
      type: "Check-up",
      status: "Waiting",
      avatar: "/images/doctor-hero.png",
    },
    {
      id: "u2",
      patientName: "Emily Rodriguez",
      time: "01:00 PM",
      type: "Consultation",
      status: "Scheduled",
      avatar: "/images/doctor-hero.png",
    },
    {
      id: "u3",
      patientName: "James Wilson",
      time: "02:30 PM",
      type: "Lab Review",
      status: "Scheduled",
      avatar: "/images/doctor-hero.png",
    },
  ],
  recentActivity: [
    {
      id: "a1",
      icon: "bi-file-earmark-medical",
      description: "Medical record updated",
      patientName: "Michael Jones",
      timestamp: "20 min ago",
    },
    {
      id: "a2",
      icon: "bi-capsule",
      description: "Prescription issued",
      patientName: "Sarah Thompson",
      timestamp: "45 min ago",
    },
    {
      id: "a3",
      icon: "bi-check2-circle",
      description: "Appointment completed",
      patientName: "Michael Jones",
      timestamp: "1 hr ago",
    },
    {
      id: "a4",
      icon: "bi-person-check",
      description: "Patient checked in",
      patientName: "David Chen",
      timestamp: "1 hr ago",
    },
    {
      id: "a5",
      icon: "bi-clipboard2-pulse",
      description: "Lab result uploaded",
      patientName: "James Wilson",
      timestamp: "2 hr ago",
    },
  ],
};

export const DOCTOR_STAT_CONFIG = [
  { key: "todayAppointments", label: "Today's Appointments", icon: "bi-calendar-event" },
  { key: "waitingPatients", label: "Waiting Patients", icon: "bi-hourglass-split" },
  { key: "completedVisits", label: "Completed Visits", icon: "bi-check2-circle" },
  { key: "upcomingAppointments", label: "Upcoming Appointments", icon: "bi-calendar-plus" },
];
