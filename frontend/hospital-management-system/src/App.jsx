import { Navigate, Route, Routes } from "react-router-dom";
import DoctorProtectedRoute from "./components/DoctorProtectedRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./components/Auth/AuthPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DoctorDashboardLayout from "./layouts/DoctorDashboardLayout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import DashboardSectionPage from "./pages/DashboardSectionPage";
import AppointmentsPage from "./pages/dashboard/AppointmentsPage";
import DoctorAppointmentsPage from "./pages/doctor/DoctorAppointmentsPage";
import DoctorDashboardPage from "./pages/doctor/DoctorDashboardPage";
import DoctorLoginPage from "./pages/doctor/DoctorLoginPage";
import DoctorPatientsPage from "./pages/doctor/DoctorPatientsPage";
import DoctorSchedulePage from "./pages/doctor/DoctorSchedulePage";
import DoctorSectionPage from "./pages/doctor/DoctorSectionPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/doctor/login" element={<DoctorLoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="medical-records" element={<DashboardSectionPage />} />
        <Route path="prescriptions" element={<DashboardSectionPage />} />
        <Route path="doctors" element={<DashboardSectionPage />} />
        <Route path="messages" element={<DashboardSectionPage />} />
        <Route path="profile" element={<DashboardSectionPage />} />
        <Route path="settings" element={<DashboardSectionPage />} />
      </Route>

      <Route
        path="/doctor/dashboard"
        element={
          <DoctorProtectedRoute>
            <DoctorDashboardLayout />
          </DoctorProtectedRoute>
        }
      >
        <Route index element={<DoctorDashboardPage />} />
        <Route path="appointments" element={<DoctorAppointmentsPage />} />
        <Route path="patients" element={<DoctorPatientsPage />} />
        <Route path="schedule" element={<DoctorSchedulePage />} />
        <Route path="medical-records" element={<DoctorSectionPage />} />
        <Route path="prescriptions" element={<DoctorSectionPage />} />
        <Route path="messages" element={<DoctorSectionPage />} />
        <Route path="profile" element={<DoctorSectionPage />} />
        <Route path="settings" element={<DoctorSectionPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
