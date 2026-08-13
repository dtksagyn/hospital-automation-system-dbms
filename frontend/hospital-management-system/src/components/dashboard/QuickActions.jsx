import { Link } from "react-router-dom";
import { QUICK_ACTIONS } from "../../data/dashboardData";

export default function QuickActions({ onBookAppointment }) {
  return (
    <section>
      <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
        <h3 className="h5 fw-bold text-ink mb-0">Quick Actions</h3>
      </div>

      <div className="row g-3">
        {QUICK_ACTIONS.map((action) => {
          const content = (
            <>
              <span className="icon-badge" style={{ width: 44, height: 44 }}>
                <i className={`bi ${action.icon}`} aria-hidden="true" />
              </span>
              <span className="fw-semibold text-ink">{action.label}</span>
            </>
          );

          if (action.action === "book") {
            return (
              <div key={action.label} className="col-6 col-lg-3">
                <button
                  type="button"
                  className="dashboard-quick-action w-100 text-start border-0"
                  onClick={onBookAppointment}
                >
                  {content}
                </button>
              </div>
            );
          }

          return (
            <div key={action.label} className="col-6 col-lg-3">
              <Link to={action.to} className="dashboard-quick-action">
                {content}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
