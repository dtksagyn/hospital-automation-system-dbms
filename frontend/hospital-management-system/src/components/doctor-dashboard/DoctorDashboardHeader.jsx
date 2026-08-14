import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDoctorAuth } from "../../context/DoctorAuthContext";
import { getDoctorGreeting } from "../../data/doctorDashboardData";
import "../dashboard/DashboardHeader.css";
import "./doctor-dashboard.css";

export default function DoctorDashboardHeader({
  title,
  onMenuToggle,
  searchQuery,
  onSearchChange,
}) {
  const { doctor, logout } = useDoctorAuth();
  const navigate = useNavigate();
  const initials = `${doctor?.firstName?.[0] || "D"}${doctor?.lastName?.[0] || "R"}`.toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/doctor/login", { replace: true });
  };

  return (
    <header className="dashboard-header doctor-dashboard-header">
      <div className="d-flex align-items-center gap-3 min-w-0 flex-grow-1">
        <button
          type="button"
          className="dashboard-header__menu"
          onClick={onMenuToggle}
          aria-label="Open menu"
        >
          <i className="bi bi-list fs-5" aria-hidden="true" />
        </button>

        <div className="min-w-0 d-none d-md-block">
          <h1 className="h5 fw-bold text-ink mb-0">{title}</h1>
          <p className="small text-ink-muted mb-0 text-truncate">
            {getDoctorGreeting()}, {doctor?.fullName || "Doctor"}
          </p>
        </div>

        <div className="doctor-dashboard-search position-relative flex-grow-1 ms-md-3">
          <i className="bi bi-search doctor-dashboard-search__icon" aria-hidden="true" />
          <input
            type="search"
            className="form-control"
            placeholder="Search patients, appointments, or records"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search patients, appointments, or records"
          />
        </div>
      </div>

      <div className="dashboard-header__actions">
        <button
          type="button"
          className="dashboard-header__icon-btn"
          aria-label="Notifications"
        >
          <i className="bi bi-bell" aria-hidden="true" />
          <span className="dashboard-header__badge" aria-hidden="true" />
        </button>

        <div className="doctor-dashboard-profile">
          <div className="doctor-dashboard-profile__meta text-end">
            <p className="small fw-semibold text-ink mb-0">{doctor?.fullName}</p>
            <p className="small text-ink-muted mb-0">{doctor?.specialty}</p>
          </div>

          <Dropdown align="end">
            <Dropdown.Toggle
              as="button"
              className="dashboard-header__avatar border-0"
              aria-label="Open doctor profile menu"
            >
              {initials}
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow-sm border-line">
              <Dropdown.Header className="small">
                <span className="d-block fw-semibold text-ink">{doctor?.fullName}</span>
                <span className="text-ink-muted">{doctor?.specialty}</span>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => navigate("/doctor/dashboard/profile")}>
                Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/doctor/dashboard/settings")}>
                Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="text-danger" onClick={handleLogout}>
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
