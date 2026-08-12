import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getGreeting } from "../../data/dashboardData";
import "./DashboardHeader.css";

export default function DashboardHeader({ title, onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.fullName?.split(" ")[0] || "Patient";
  const initials = user?.fullName
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="dashboard-header">
      <div className="d-flex align-items-center gap-3 min-w-0">
        <button
          type="button"
          className="dashboard-header__menu"
          onClick={onMenuToggle}
          aria-label="Open menu"
        >
          <i className="bi bi-list fs-5" aria-hidden="true" />
        </button>

        <div className="min-w-0">
          <h1 className="h5 fw-bold text-ink mb-0">{title}</h1>
          <p className="small text-ink-muted mb-0 text-truncate">
            {getGreeting()}, {firstName}
          </p>
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

        <Dropdown align="end">
          <Dropdown.Toggle
            as="button"
            className="dashboard-header__avatar border-0"
            aria-label="Open profile menu"
          >
            {initials}
          </Dropdown.Toggle>

          <Dropdown.Menu className="shadow-sm border-line">
            <Dropdown.Header className="small">
              <span className="d-block fw-semibold text-ink">{user?.fullName}</span>
              <span className="text-ink-muted">{user?.email}</span>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => navigate("/dashboard/profile")}>
              Profile
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/dashboard/settings")}>
              Settings
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item className="text-danger" onClick={handleLogout}>
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
}
