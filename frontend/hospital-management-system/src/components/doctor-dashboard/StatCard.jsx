export default function StatCard({ icon, value, label, trend }) {
  return (
    <div className="card-elevated dashboard-stat-card p-3 p-md-4 h-100">
      <div className="d-flex align-items-center gap-3">
        <span className="icon-badge flex-shrink-0" style={{ width: 48, height: 48 }}>
          <i className={`bi ${icon} fs-5`} aria-hidden="true" />
        </span>
        <div>
          <p className="fs-4 fw-bold text-ink mb-0 lh-1">{value}</p>
          <p className="small text-ink-muted mb-0 mt-1">{label}</p>
          {trend && <p className="small text-brand fw-semibold mb-0 mt-1">{trend}</p>}
        </div>
      </div>
    </div>
  );
}
