import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./components/Auth/AuthPage";
import DashboardLayout from "./layouts/DashboardLayout";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import DashboardSectionPage from "./pages/DashboardSectionPage";
import AppointmentsPage from "./pages/dashboard/AppointmentsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthPage />} />

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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
