export default function CtaSection({ onBookAppointment }) {
  return (
    <section id="contact" className="container-xl pb-5 mb-3">
      <div className="bg-brand rounded-4xl position-relative overflow-hidden px-4 px-sm-5 py-5">
        <i
          className="bi bi-plus-lg cta-decor position-absolute text-white opacity-10"
          style={{ right: '-0.25rem', top: '1.5rem', fontSize: '6rem' }}
          aria-hidden="true"
        />

        <div className="position-relative d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-4">
          <div>
            <h2 className="display-6 fw-bold text-white lh-sm mb-2">
              Your Health Journey
              <br />
              Starts Here
            </h2>
            <p className="text-white opacity-75 mb-0" style={{ maxWidth: '30rem' }}>
              Book an appointment today and take the first step toward better health with Nuvica
              Hospital.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-on-brand rounded-pill flex-shrink-0 d-inline-flex align-items-center gap-2 px-4 py-3"
            onClick={onBookAppointment}
          >
            Book Appointment
            <span className="icon-badge bg-brand bg-opacity-10" style={{ width: 28, height: 28 }}>
              <i className="bi bi-arrow-right-short" aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
