import { useLocation } from "react-router-dom";
import { DASHBOARD_NAV } from "../data/dashboardData";

export default function DashboardSectionPage() {
  const location = useLocation();
  const section = DASHBOARD_NAV.find((item) => item.to === location.pathname);

  return (
    <div className="card-elevated p-4 p-md-5">
      <span className="icon-badge mb-3" style={{ width: 48, height: 48 }}>
        <i className={`bi ${section?.icon || "bi-grid-1x2-fill"}`} aria-hidden="true" />
      </span>
      <h2 className="h4 fw-bold text-ink mb-2">{section?.label || "Dashboard Section"}</h2>
      <p className="text-ink-muted mb-0">
        This section is ready for future patient features. The navigation,
        layout, and styling are connected to the CareMed design system.
      </p>
    </div>
  );
}
