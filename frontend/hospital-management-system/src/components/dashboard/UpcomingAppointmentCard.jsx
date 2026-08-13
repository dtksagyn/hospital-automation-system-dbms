import { useState } from "react";
import { Alert } from "react-bootstrap";
import { cancelAppointment } from "../../services/api";
import { getStatusClass } from "../../data/dashboardData";

export default function UpcomingAppointmentCard({ appointment, onCancel }) {
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  if (!appointment) {
    return (
      <section className="card-elevated p-4">
        <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
          <div>
            <h3 className="h5 fw-bold text-ink mb-1">Upcoming Appointment</h3>
            <p className="small text-ink-muted mb-0">You have no upcoming visits scheduled.</p>
          </div>
        </div>
        <p className="small text-ink-muted mb-0">
          Book an appointment to see your next visit here.
        </p>
      </section>
    );
  }

  const handleCancel = async () => {
    setError("");
    setCancelling(true);

    try {
      await cancelAppointment(appointment.appointmentId);
      onCancel?.();
    } catch (cancelError) {
      setError(cancelError.message);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <section className="card-elevated p-4">
      <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="h5 fw-bold text-ink mb-1">Upcoming Appointment</h3>
          <p className="small text-ink-muted mb-0">Your next scheduled visit</p>
        </div>
        <span className={getStatusClass(appointment.status)}>{appointment.status}</span>
      </div>

      {error && (
        <Alert variant="danger" className="py-2 small">
          {error}
        </Alert>
      )}

      <div className="row g-4 align-items-center">
        <div className="col-md-auto">
          <img
            src={appointment.avatar}
            alt={appointment.doctorName}
            className="dashboard-appointment-card__avatar"
          />
        </div>

        <div className="col-md">
          <p className="fw-bold text-ink mb-1">{appointment.doctorName}</p>
          <p className="small text-brand fw-semibold mb-3">{appointment.specialty}</p>

          <div className="row g-3">
            <div className="col-sm-6">
              <p className="small text-ink-muted mb-1">Date</p>
              <p className="fw-semibold text-ink mb-0">{appointment.date}</p>
            </div>
            <div className="col-sm-6">
              <p className="small text-ink-muted mb-1">Time</p>
              <p className="fw-semibold text-ink mb-0">{appointment.time}</p>
            </div>
            <div className="col-sm-6">
              <p className="small text-ink-muted mb-1">Type</p>
              <p className="fw-semibold text-ink mb-0">{appointment.type}</p>
            </div>
            <div className="col-sm-6">
              <p className="small text-ink-muted mb-1">Location</p>
              <p className="fw-semibold text-ink mb-0">{appointment.location}</p>
            </div>
          </div>
        </div>

        <div className="col-md-auto d-flex flex-column flex-sm-row flex-md-column gap-2">
          <button type="button" className="btn btn-brand rounded-pill px-4 py-2">
            View Details
          </button>
          <button type="button" className="btn btn-outline-primary rounded-pill px-4 py-2">
            Reschedule
          </button>
          <button
            type="button"
            className="btn btn-link text-danger text-decoration-none px-0"
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? "Cancelling..." : "Cancel"}
          </button>
        </div>
      </div>
    </section>
  );
}
