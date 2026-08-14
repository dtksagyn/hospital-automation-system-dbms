import { Link } from "react-router-dom";
import { DOCTOR_QUICK_ACTIONS } from "../../data/doctorDashboardData";

export default function QuickAction({ action, onAction }) {
  const content = (
    <>
      <span className="icon-badge" style={{ width: 44, height: 44 }}>
        <i className={`bi ${action.icon}`} aria-hidden="true" />
      </span>
      <span className="fw-semibold text-ink">{action.label}</span>
    </>
  );

  if (action.action) {
    return (
      <button
        type="button"
        className="dashboard-quick-action w-100 text-start border-0"
        onClick={() => onAction?.(action.action)}
      >
        {content}
      </button>
    );
  }

  return (
    <Link to={action.to} className="dashboard-quick-action">
      {content}
    </Link>
  );
}

export function DoctorQuickActions({ onAction }) {
  return (
    <section>
      <div className="mb-3">
        <h3 className="h5 fw-bold text-ink mb-0">Quick Actions</h3>
      </div>
      <div className="row g-3">
        {DOCTOR_QUICK_ACTIONS.map((action) => (
          <div key={action.label} className="col-6 col-lg-4 col-xl">
            <QuickAction action={action} onAction={onAction} />
          </div>
        ))}
      </div>
    </section>
  );
}
