import { DASHBOARD_STATS, getStatusClass } from "../../data/dashboardData";

export default function DashboardStatCards({ stats }) {
  const statItems = DASHBOARD_STATS.map((stat) => ({
    ...stat,
    value: stats?.[stat.key] ?? 0,
  }));

  return (
    <section>
      <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
        <h3 className="h5 fw-bold text-ink mb-0">Overview</h3>
      </div>

      <div className="row g-3">
        {statItems.map((stat) => (
          <div key={stat.label} className="col-6 col-xl-3">
            <div className="card-elevated dashboard-stat-card p-3 p-md-4">
              <div className="d-flex align-items-center gap-3">
                <span className="icon-badge flex-shrink-0" style={{ width: 48, height: 48 }}>
                  <i className={`bi ${stat.icon} fs-5`} aria-hidden="true" />
                </span>
                <div>
                  <p className="fs-4 fw-bold text-ink mb-0 lh-1">{stat.value}</p>
                  <p className="small text-ink-muted mb-0 mt-1">{stat.label}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export { getStatusClass };
