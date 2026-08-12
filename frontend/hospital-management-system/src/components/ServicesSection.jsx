import './ServicesSection.css'

const SERVICES = [
  {
    icon: 'bi-heart-pulse',
    title: 'Cardiology',
    description: 'Advanced care for your heart and vascular health.',
  },
  {
    icon: 'bi-wind',
    title: 'Pulmonology',
    description: 'Comprehensive care for lung and respiratory health.',
  },
  {
    icon: 'bi-cpu',
    title: 'Neurology',
    description: 'Expert care for brain and nervous system disorders.',
  },
  {
    icon: 'bi-emoji-smile',
    title: 'Pediatrics',
    description: 'Specialized care for your little ones.',
  },
]

export default function ServicesSection() {
  return (
    <section id="departments" className="container-xl py-5 my-4">
      <div id="services" className="d-flex flex-wrap align-items-end justify-content-between gap-3">
        <div>
          <p className="d-flex align-items-center gap-2 small fw-semibold text-uppercase tracking-wide-2 text-brand mb-2">
            <i className="bi bi-activity" aria-hidden="true" />
            Our Services
          </p>
          <h2 className="display-6 fw-bold text-ink mb-0">Comprehensive Care</h2>
        </div>
      </div>

      <div className="row g-4 mt-2">
        {SERVICES.map(({ icon, title, description }) => (
          <div key={title} className="col-sm-6 col-lg-3">
            <article className="service-card h-100 p-4">
              <span className="icon-badge" style={{ width: 56, height: 56 }}>
                <i className={`bi ${icon} fs-4`} aria-hidden="true" />
              </span>
              <h3 className="fs-4 fw-bold text-ink mt-4 mb-2">{title}</h3>
              <p className="small text-ink-muted mb-0">{description}</p>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}
