export default function ActivityItem({ activity }) {
  return (
    <article className="doctor-activity-item">
      <span className="icon-badge flex-shrink-0" style={{ width: 40, height: 40 }}>
        <i className={`bi ${activity.icon}`} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="fw-semibold text-ink mb-1">{activity.description}</p>
        <p className="small text-ink-muted mb-0">
          {activity.patientName} · {activity.timestamp}
        </p>
      </div>
    </article>
  );
}

export function RecentActivity({ activities = [] }) {
  return (
    <section className="card-elevated p-4">
      <div className="mb-3">
        <h3 className="h5 fw-bold text-ink mb-1">Recent Activity</h3>
        <p className="small text-ink-muted mb-0">Latest updates across your patients</p>
      </div>

      {activities.length === 0 ? (
        <p className="text-ink-muted mb-0">No recent activity yet.</p>
      ) : (
        activities.map((activity) => <ActivityItem key={activity.id} activity={activity} />)
      )}
    </section>
  );
}
