import { formatAppointmentDate, getDoctorStatusClass } from "../../data/doctorDashboardData";

export default function PatientCard({ patient }) {
  return (
    <article className="doctor-patient-card">
      <img src={patient.avatar} alt="" className="doctor-patient-card__avatar" />
      <div className="flex-grow-1 min-w-0">
        <p className="fw-semibold text-ink mb-1 text-truncate">{patient.patientName}</p>
        <p className="small text-ink-muted mb-0">
          {formatAppointmentDate(patient.date)} · {patient.time} · {patient.type}
        </p>
      </div>
      <div className="d-flex flex-column align-items-end gap-2">
        <span className={getDoctorStatusClass(patient.status)}>{patient.status}</span>
        <button type="button" className="btn btn-sm btn-outline-primary rounded-pill px-3">
          View
        </button>
      </div>
    </article>
  );
}

export function UpcomingPatients({ patients = [] }) {
  return (
    <section className="card-elevated p-4">
      <div className="mb-3">
        <h3 className="h5 fw-bold text-ink mb-1">Upcoming Patients</h3>
        <p className="small text-ink-muted mb-0">Next patients on your schedule</p>
      </div>

      {patients.length === 0 ? (
        <p className="text-ink-muted mb-0">No upcoming patients.</p>
      ) : (
        patients.map((patient) => <PatientCard key={patient.id} patient={patient} />)
      )}
    </section>
  );
}
