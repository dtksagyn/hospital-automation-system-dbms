import "./AboutSection.css";

const FEATURES = [
  { icon: "bi-building", label: "Modern Infrastructure" },
  { icon: "bi-shield-plus", label: "24/7 Emergency Support" },
  { icon: "bi-heart", label: "Experienced Medical Team" },
  { icon: "bi-person-hearts", label: "Patient-Centered Approach" },
];

export default function AboutSection() {
  return (
    <section id="about" className="container-xl pb-5 mb-4">
      <div className="row g-4 align-items-stretch">
        <div className="col-lg-6">
          <div className="rounded-4xl overflow-hidden h-100">
            <img
              src="/images/hospital-building.png"
              alt="Modern CareMed Hospital building with a glass facade"
              className="w-100 h-100 object-fit-cover about-section__image"
            />
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card-elevated h-100 p-4 p-sm-5">
            <p className="small fw-semibold text-uppercase tracking-wide-2 text-brand mb-3">
              About Us
            </p>
            <h2 className="display-6 fw-bold text-ink mb-3">
              Care You Can Trust
            </h2>
            <p className="text-ink-muted mb-4">
              CareMed Hospital combines modern medical technology with a
              compassionate team dedicated to your wellbeing. From routine
              check-ups to specialized treatment, we provide reliable care in a
              calm, professional environment.
            </p>

            <div className="row g-3">
              {FEATURES.map(({ icon, label }) => (
                <div key={label} className="col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="icon-badge flex-shrink-0"
                      style={{ width: 40, height: 40 }}
                    >
                      <i className={`bi ${icon}`} aria-hidden="true" />
                    </span>
                    <span className="small fw-semibold text-ink">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
