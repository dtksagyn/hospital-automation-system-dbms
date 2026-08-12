import "./HeroSection.css";

const HIGHLIGHTS = [
  "Expert Doctors",
  "Advanced Technology",
  "Personalized Care",
];

export default function HeroSection({ onBookAppointment }) {
  return (
    <section id="home" className="hero-wash overflow-hidden">
      <div className="container-xl py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <span className="d-inline-flex align-items-center gap-2 rounded-pill border border-line bg-white px-3 py-2 small fw-medium text-ink shadow-sm">
              <i className="bi bi-shield-check text-brand" aria-hidden="true" />
              Trusted Care. Better Health.
            </span>

            <h1 className="display-3 fw-bold text-ink mt-4 mb-0 lh-sm">
              Your Health,
              <br />
              <span className="text-brand">Our Priority</span>
            </h1>

            <p className="fs-5 text-ink-muted mt-4 mb-0 hero-section__lead">
              Expert doctors, advanced technology, and compassionate care — all
              under one roof.
            </p>

            <ul className="list-unstyled d-flex flex-column gap-3 mt-4 mb-0">
              {HIGHLIGHTS.map((item) => (
                <li
                  key={item}
                  className="d-flex align-items-center gap-2 fw-medium text-ink"
                >
                  <i
                    className="bi bi-check-circle-fill text-brand"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="btn btn-brand rounded-pill d-inline-flex align-items-center gap-2 px-4 py-3 mt-4"
              onClick={onBookAppointment}
            >
              Book Appointment
              <span
                className="icon-badge bg-white bg-opacity-25 text-white"
                style={{ width: 28, height: 28 }}
              >
                <i className="bi bi-arrow-right-short" aria-hidden="true" />
              </span>
            </button>
          </div>

          <div className="col-lg-6 text-center">
            <div className=" hero-doctor-frame">
              <img
                src="/images/doctor-hero.png"
                alt="Smiling CareMed Hospital doctor in a white coat with a stethoscope"
                className="w-100 h-100 object-fit-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
