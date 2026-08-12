import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { DASHBOARD_NAV } from "../../data/dashboardData";
import "./DashboardSidebar.css";

function SidebarLogo() {
  return (
    <Link to="/dashboard" className="d-flex align-items-center gap-2 text-decoration-none">
      <span
        className="icon-badge bg-brand text-white"
        style={{ width: 40, height: 40 }}
      >
        <i className="bi bi-heart-pulse-fill" aria-hidden="true" />
      </span>
      <span className="d-flex flex-column align-items-start lh-1">
        <span className="d-block fs-5 fw-bold text-ink">CareMed</span>
        <span
          className="d-block text-uppercase tracking-wide-2 text-ink-muted fw-semibold"
          style={{ fontSize: "0.72rem" }}
        >
          Patient Portal
        </span>
      </span>
    </Link>
  );
}

export default function DashboardSidebar({ open, onClose }) {
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia("(min-width: 992px)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 992px)");
    const handleChange = (event) => setIsDesktop(event.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dashboard-sidebar-open", open);
    return () => document.body.classList.remove("dashboard-sidebar-open");
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <>
      <aside
        className={`dashboard-sidebar${open ? " is-open" : ""}`}
        aria-hidden={!isDesktop && !open}
      >
        <div className="dashboard-sidebar__brand">
          <SidebarLogo />
        </div>

        <nav className="dashboard-sidebar__nav" aria-label="Dashboard navigation">
          <div className="dashboard-sidebar__links">
            {DASHBOARD_NAV.map((item) => {
              const isActive =
                location.pathname === item.to ||
                (item.to !== "/dashboard" && location.pathname.startsWith(item.to));

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`dashboard-sidebar__link${isActive ? " is-active" : ""}`}
                  onClick={onClose}
                >
                  <i className={`bi ${item.icon}`} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="dashboard-sidebar__footer">
          <Link
            to="/"
            className="dashboard-sidebar__link"
            onClick={onClose}
          >
            <i className="bi bi-house" aria-hidden="true" />
            <span>Back to Website</span>
          </Link>
        </div>
      </aside>

      <button
        type="button"
        className={`dashboard-sidebar-backdrop${open ? " is-open" : ""}`}
        aria-label="Close menu"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />
    </>
  );
}
