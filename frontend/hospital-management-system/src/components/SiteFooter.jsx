import "./SiteFooter.css";

const LINK_GROUPS = [
  {
    title: "Departments",
    links: ["Cardiology", "Pulmonology", "Neurology", "Pediatrics"],
  },
  {
    title: "Company",
    links: ["About Us", "Our Doctors", "Services", "Careers"],
  },
];

const CONTACT = [
  { icon: "bi-geo-alt", text: "123 Wellness Ave, Health City" },
  { icon: "bi-telephone", text: "+1 (555) 000-1234" },
  { icon: "bi-envelope", text: "care@med.health" },
];

export default function SiteFooter() {
  return (
    <footer
      id="contact"
      className="site-footer border-top border-line bg-white"
    >
      <div className="container-xl py-5">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="d-flex align-items-center gap-2">
              <span
                className="icon-badge bg-brand text-white"
                style={{ width: 40, height: 40 }}
              >
                <i className="bi bi-heart-pulse-fill" aria-hidden="true" />
              </span>
              <span className="lh-1">
                <span className="d-block fs-4 fw-bold text-ink">CareMed</span>
                <span
                  className="d-block text-uppercase tracking-wide-2 text-ink-muted fw-semibold"
                  style={{ fontSize: "1rem" }}
                >
                  Hospital
                </span>
              </span>
            </div>
            <p className="text-ink-muted mt-3 mb-0 site-footer__description">
              Expert doctors, advanced technology, and compassionate care — all
              under one roof.
            </p>
            <ul className="list-unstyled d-flex flex-column gap-2 mt-3 mb-0 small text-ink-muted">
              {CONTACT.map(({ icon, text }) => (
                <li key={text} className="d-flex align-items-center gap-2">
                  <i className={`bi ${icon} text-brand`} aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {LINK_GROUPS.map((group) => (
            <div key={group.title} className="col-6 col-lg-3">
              <h3 className="small fw-bold text-ink">{group.title}</h3>
              <ul className="list-unstyled d-flex flex-column gap-2 mt-3 mb-0 small">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#departments" className="nav-link-brand">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-top border-line">
        <p className="container-xl py-4 text-center small text-ink-muted mb-0">
          © {new Date().getFullYear()} CareMed Hospital. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
