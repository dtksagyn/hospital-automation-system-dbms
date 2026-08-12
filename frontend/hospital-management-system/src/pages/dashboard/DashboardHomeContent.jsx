import { Alert, Spinner } from "react-bootstrap";
import { useDashboardSummary } from "../../hooks/useDashboardSummary";
import WelcomeSection from "../../components/dashboard/WelcomeSection";
import UpcomingAppointmentCard from "../../components/dashboard/UpcomingAppointmentCard";
import DashboardStatCards from "../../components/dashboard/DashboardStatCards";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentAppointments from "../../components/dashboard/RecentAppointments";
import "../../components/dashboard/dashboard.css";

export default function DashboardHomeContent({
  onBookAppointment,
  onRefreshDashboard,
}) {
  const { data, loading, error, refresh } = useDashboardSummary();

  const handleRefresh = async () => {
    await refresh();
    onRefreshDashboard?.();
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <div className="text-center">
          <Spinner animation="border" className="text-brand mb-3" role="status">
            <span className="visually-hidden">Loading dashboard...</span>
          </Spinner>
          <p className="text-ink-muted mb-0">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      {error && (
        <Alert variant="danger" className="py-2 small mb-0">
          {error}
        </Alert>
      )}

      <WelcomeSection onBookAppointment={onBookAppointment} />
      <UpcomingAppointmentCard
        appointment={data.upcomingAppointment}
        onCancel={handleRefresh}
      />
      <DashboardStatCards stats={data.stats} />
      <QuickActions onBookAppointment={onBookAppointment} />
      <RecentAppointments appointments={data.recentAppointments} />
    </div>
  );
}
