import { useAuth } from "../../context/AuthContext";

export default function WelcomeSection({ onBookAppointment }) {
  const { user } = useAuth();
  const firstName = user?.fullName?.split(" ")[0] || "there";

  return (
    <section className="card-elevated dashboard-welcome p-4 p-md-5">
      <div className="row align-items-center g-4">
        <div className="col-lg-8">
          <span className="d-inline-flex align-items-center gap-2 rounded-pill border border-line bg-white px-3 py-2 small fw-medium text-ink shadow-sm">
            <i className="bi bi-shield-check text-brand" aria-hidden="true" />
            Your care, organized in one place
          </span>
          <h2 className="display-6 fw-bold text-ink mt-3 mb-2">
            Welcome back, {firstName}
          </h2>
          <p className="text-ink-muted mb-0">
            Review upcoming visits, access medical records, and manage your
            healthcare journey with CareMed Hospital.
          </p>
        </div>
        <div className="col-lg-4 d-flex justify-content-lg-end">
          <button
            type="button"
            className="btn btn-brand rounded-pill d-inline-flex align-items-center gap-2 px-4 py-3"
            onClick={onBookAppointment}
          >
            Book an Appointment
            <span
              className="icon-badge bg-white bg-opacity-25 text-white"
              style={{ width: 28, height: 28 }}
            >
              <i className="bi bi-arrow-right-short" aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
