import { formatAppointmentDate, getDoctorStatusClass } from "../../data/doctorDashboardData";
import { updateDoctorAppointmentStatus } from "../../services/api";

export default function AppointmentTable({ appointments = [], onStatusChange }) {
  async function handleStartConsultation(appointmentId) {
    try {
      await updateDoctorAppointmentStatus(appointmentId, "in_progress");
      onStatusChange?.();
    } catch (startError) {
      window.alert(startError.message);
    }
  }

  if (appointments.length === 0) {
    return (
      <section className="card-elevated p-4">
        <h3 className="h5 fw-bold text-ink mb-2">Today&apos;s Appointments</h3>
        <p className="text-ink-muted mb-0">No appointments scheduled for today.</p>
      </section>
    );
  }

  return (
    <section className="card-elevated p-4">
      <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="h5 fw-bold text-ink mb-1">Today&apos;s Appointments</h3>
          <p className="small text-ink-muted mb-0">Manage your patient visits for today</p>
        </div>
      </div>

      <div className="dashboard-table-wrap d-none d-xl-block">
        <table className="table dashboard-table align-middle">
          <thead>
            <tr>
              <th scope="col">Patient</th>
              <th scope="col">Date</th>
              <th scope="col">Age</th>
              <th scope="col">Time</th>
              <th scope="col">Type</th>
              <th scope="col">Reason</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={appointment.avatar}
                      alt=""
                      className="doctor-appointment-row__avatar"
                    />
                    <span className="fw-semibold text-ink">{appointment.patientName}</span>
                  </div>
                </td>
                <td className="text-ink-muted">{formatAppointmentDate(appointment.date)}</td>
                <td className="text-ink-muted">{appointment.age ?? "—"}</td>
                <td className="fw-medium text-ink">{appointment.time}</td>
                <td className="text-ink-muted">{appointment.type}</td>
                <td className="text-ink-muted">{appointment.reason}</td>
                <td>
                  <span className={getDoctorStatusClass(appointment.status)}>
                    {appointment.status}
                  </span>
                </td>
                <td>
                  <div className="doctor-appointment-actions">
                    <button type="button" className="btn btn-sm btn-outline-primary rounded-pill px-3">
                      View Patient
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 ${
                        appointment.status === "In Progress" ? "btn-brand" : "btn-outline-secondary"
                      }`}
                      onClick={() => handleStartConsultation(appointment.appointmentId)}
                      disabled={appointment.status === "Completed" || appointment.status === "Cancelled"}
                    >
                      Start Consultation
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dashboard-mobile-list d-xl-none">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onStartConsultation={handleStartConsultation}
          />
        ))}
      </div>
    </section>
  );
}

function AppointmentCard({ appointment, onStartConsultation }) {
  return (
    <article className="dashboard-mobile-item">
      <div className="d-flex align-items-start gap-3 mb-3">
        <img src={appointment.avatar} alt="" className="doctor-appointment-row__avatar" />
        <div className="flex-grow-1">
          <div className="d-flex align-items-start justify-content-between gap-2">
            <div>
              <p className="fw-semibold text-ink mb-1">{appointment.patientName}</p>
              <p className="small text-ink-muted mb-0">
                {formatAppointmentDate(appointment.date)} · {appointment.time} · {appointment.type}
              </p>
            </div>
            <span className={getDoctorStatusClass(appointment.status)}>
              {appointment.status}
            </span>
          </div>
        </div>
      </div>
      <p className="small text-ink-muted mb-3">{appointment.reason}</p>
      <div className="doctor-appointment-actions">
        <button type="button" className="btn btn-sm btn-outline-primary rounded-pill px-3">
          View Patient
        </button>
        <button
          type="button"
          className={`btn btn-sm rounded-pill px-3 ${
            appointment.status === "In Progress" ? "btn-brand" : "btn-outline-secondary"
          }`}
          onClick={() => onStartConsultation(appointment.appointmentId)}
          disabled={appointment.status === "Completed" || appointment.status === "Cancelled"}
        >
          Start Consultation
        </button>
      </div>
    </article>
  );
}

export { AppointmentCard };
