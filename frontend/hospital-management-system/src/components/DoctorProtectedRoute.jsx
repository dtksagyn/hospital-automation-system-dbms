import { Navigate, useLocation } from "react-router-dom";
import { useDoctorAuth } from "../context/DoctorAuthContext";

export default function DoctorProtectedRoute({ children }) {
  const { authStatus } = useDoctorAuth();
  const location = useLocation();

  if (authStatus === "loading") {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-surface">
        <div className="text-center">
          <div className="spinner-border text-brand mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-ink-muted mb-0">Loading doctor dashboard...</p>
        </div>
      </div>
    );
  }

  if (authStatus !== "authenticated") {
    return <Navigate to="/doctor/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
