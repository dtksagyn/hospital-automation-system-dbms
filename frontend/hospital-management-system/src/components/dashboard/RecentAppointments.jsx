import { getStatusClass } from "../../data/dashboardData";

export default function RecentAppointments({ appointments = [] }) {
  if (appointments.length === 0) {
    return (
      <section className="card-elevated p-4">
        <h3 className="h5 fw-bold text-ink mb-2">Recent Appointments</h3>
        <p className="text-ink-muted mb-0">No appointments yet. Book your first visit to get started.</p>
      </section>
    );
  }

  return (
    <section className="card-elevated p-4">
      <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="h5 fw-bold text-ink mb-1">Recent Appointments</h3>
          <p className="small text-ink-muted mb-0">Your latest visits and scheduled care</p>
        </div>
      </div>

      <div className="dashboard-table-wrap d-none d-lg-block">
        <table className="table dashboard-table align-middle">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Doctor</th>
              <th scope="col">Department</th>
              <th scope="col">Type</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>
                  <span className="d-block fw-semibold text-ink">{appointment.date}</span>
                  <span className="small text-ink-muted">{appointment.time}</span>
                </td>
                <td className="fw-medium text-ink">{appointment.doctor}</td>
                <td className="text-ink-muted">{appointment.department}</td>
                <td className="text-ink-muted">{appointment.type}</td>
                <td>
                  <span className={getStatusClass(appointment.status)}>
                    {appointment.status}
                  </span>
                </td>
                <td>
                  <button type="button" className="btn btn-sm btn-outline-primary rounded-pill px-3">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dashboard-mobile-list d-lg-none">
        {appointments.map((appointment) => (
          <article key={appointment.id} className="dashboard-mobile-item">
            <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
              <div>
                <p className="fw-semibold text-ink mb-1">{appointment.doctor}</p>
                <p className="small text-ink-muted mb-0">{appointment.department}</p>
              </div>
              <span className={getStatusClass(appointment.status)}>
                {appointment.status}
              </span>
            </div>

            <div className="row g-2 small">
              <div className="col-6">
                <span className="text-ink-muted d-block">Date</span>
                <span className="fw-medium text-ink">{appointment.date}</span>
              </div>
              <div className="col-6">
                <span className="text-ink-muted d-block">Type</span>
                <span className="fw-medium text-ink">{appointment.type}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-outline-primary rounded-pill px-3 mt-3"
            >
              View Details
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
