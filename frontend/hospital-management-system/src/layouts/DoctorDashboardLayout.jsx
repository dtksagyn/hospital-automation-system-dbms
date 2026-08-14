import { useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DoctorDashboardHeader from "../components/doctor-dashboard/DoctorDashboardHeader";
import {
  DOCTOR_DASHBOARD_HOME,
  DOCTOR_DASHBOARD_NAV,
} from "../data/doctorDashboardData";
import "../components/dashboard/dashboard.css";
import "../components/doctor-dashboard/doctor-dashboard.css";

function getPageTitle(pathname) {
  const match = DOCTOR_DASHBOARD_NAV.find(
    (item) => pathname === item.to || pathname.startsWith(`${item.to}/`),
  );

  return match?.label === "Dashboard"
    ? "Doctor Dashboard"
    : match?.label || "Doctor Dashboard";
}

export default function DoctorDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scheduleRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const pageTitle = getPageTitle(location.pathname);

  const scrollToSchedule = () => {
    if (location.pathname !== DOCTOR_DASHBOARD_HOME) {
      navigate(DOCTOR_DASHBOARD_HOME, { state: { scrollToSchedule: true } });
      return;
    }

    scheduleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="dashboard-shell">
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navItems={DOCTOR_DASHBOARD_NAV}
        homePath={DOCTOR_DASHBOARD_HOME}
        portalLabel="Doctor Portal"
      />

      <div className="dashboard-main">
        <DoctorDashboardHeader
          title={pageTitle}
          onMenuToggle={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="dashboard-content">
          <Outlet
            context={{
              searchQuery,
              scheduleRef,
              onViewSchedule: scrollToSchedule,
            }}
          />
        </div>
      </div>
    </div>
  );
}
