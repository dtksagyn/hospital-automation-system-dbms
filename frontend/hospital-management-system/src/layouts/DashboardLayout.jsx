import { useCallback, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppointmentModal from "../components/AppointmentModal";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import { DASHBOARD_NAV } from "../data/dashboardData";
import "../components/dashboard/dashboard.css";
function getPageTitle(pathname) {
  const match = DASHBOARD_NAV.find(
    (item) => pathname === item.to || pathname.startsWith(`${item.to}/`),
  );

  return match?.label || "Dashboard";
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  const openAppointmentModal = () => setShowAppointmentModal(true);
  const closeAppointmentModal = () => setShowAppointmentModal(false);
  const refreshDashboard = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  return (
    <div className="dashboard-shell">
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="dashboard-main">
        <DashboardHeader
          title={pageTitle}
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <div className="dashboard-content">
          <Outlet
            context={{
              onBookAppointment: openAppointmentModal,
              onRefreshDashboard: refreshDashboard,
              refreshKey,
            }}
          />
        </div>
      </div>

      <AppointmentModal
        show={showAppointmentModal}
        onHide={closeAppointmentModal}
        onBooked={refreshDashboard}
      />
    </div>
  );
}
