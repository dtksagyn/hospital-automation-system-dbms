export const DASHBOARD_NAV = [
  { label: "Dashboard", to: "/dashboard", icon: "bi-grid-1x2-fill" },
  { label: "Appointments", to: "/dashboard/appointments", icon: "bi-calendar-check" },
  { label: "Medical Records", to: "/dashboard/medical-records", icon: "bi-file-earmark-medical" },
  { label: "Prescriptions", to: "/dashboard/prescriptions", icon: "bi-capsule" },
  { label: "Doctors", to: "/dashboard/doctors", icon: "bi-person-badge" },
  { label: "Messages", to: "/dashboard/messages", icon: "bi-chat-dots" },
  { label: "Profile", to: "/dashboard/profile", icon: "bi-person-circle" },
  { label: "Settings", to: "/dashboard/settings", icon: "bi-gear" },
];

export const DASHBOARD_STATS = [
  { key: "upcomingAppointments", label: "Upcoming Appointments", icon: "bi-calendar-event" },
  { key: "completedVisits", label: "Completed Visits", icon: "bi-check2-circle" },
  { key: "prescriptions", label: "Prescriptions", icon: "bi-capsule" },
  { key: "medicalRecords", label: "Medical Records", icon: "bi-folder2-open" },
];

export const QUICK_ACTIONS = [
  { label: "Book Appointment", icon: "bi-calendar-plus", action: "book" },
  { label: "View Doctors", icon: "bi-person-badge", to: "/dashboard/doctors" },
  { label: "Medical Records", icon: "bi-file-earmark-medical", to: "/dashboard/medical-records" },
  { label: "Prescriptions", icon: "bi-capsule", to: "/dashboard/prescriptions" },
];

export function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getStatusClass(status) {
  switch (status) {
    case "Scheduled":
      return "dashboard-status dashboard-status--scheduled";
    case "Completed":
      return "dashboard-status dashboard-status--completed";
    case "Cancelled":
      return "dashboard-status dashboard-status--cancelled";
    case "Pending":
      return "dashboard-status dashboard-status--pending";
    default:
      return "dashboard-status";
  }
}
