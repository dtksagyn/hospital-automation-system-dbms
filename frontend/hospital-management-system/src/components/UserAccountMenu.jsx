import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserAccountMenu({ onNavigate, className = "" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.fullName?.split(" ")[0] || "User";

  const handleDashboard = () => {
    onNavigate?.();
    navigate("/dashboard");
  };

  const handleLogout = async () => {
    onNavigate?.();
    await logout();
    navigate("/");
  };

  return (
    <Dropdown align="end" className={className}>
      <Dropdown.Toggle
        className="site-header-user-menu"
        id="site-header-user-menu"
        aria-label="Open account menu"
      >
        Hi, {firstName} <span aria-hidden="true">▾</span>
      </Dropdown.Toggle>

      <Dropdown.Menu className="shadow-sm border-line">
        <Dropdown.Item onClick={handleDashboard}>Dashboard</Dropdown.Item>
        <Dropdown.Item className="text-danger" onClick={handleLogout}>
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
