import { useOutletContext } from "react-router-dom";
import DashboardHomeContent from "./dashboard/DashboardHomeContent";

export default function DashboardPage() {
  const { onBookAppointment, onRefreshDashboard, refreshKey } = useOutletContext();

  return (
    <DashboardHomeContent
      key={refreshKey}
      onBookAppointment={onBookAppointment}
      onRefreshDashboard={onRefreshDashboard}
    />
  );
}
