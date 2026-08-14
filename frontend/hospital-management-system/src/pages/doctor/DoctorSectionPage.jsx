import { useLocation } from "react-router-dom";
import { DOCTOR_DASHBOARD_NAV } from "../../data/doctorDashboardData";

export default function DoctorSectionPage() {
  const location = useLocation();
  const section = DOCTOR_DASHBOARD_NAV.find((item) => item.to === location.pathname);

  return (
    <div className="card-elevated p-4 p-md-5">
      <span className="icon-badge mb-3" style={{ width: 48, height: 48 }}>
        <i className={`bi ${section?.icon || "bi-grid-1x2-fill"}`} aria-hidden="true" />
      </span>
      <h2 className="h4 fw-bold text-ink mb-2">{section?.label || "Doctor Section"}</h2>
      <p className="text-ink-muted mb-0">
        This doctor workspace section is ready for future features while keeping the
        same CareMed design system and navigation structure.
      </p>
    </div>
  );
}
