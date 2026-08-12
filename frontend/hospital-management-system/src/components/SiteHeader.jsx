import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import "./SiteHeader.css";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Departments", href: "#departments" },
  { label: "Doctors", href: "#doctors" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

function Logo() {
  return (
    <a
      href="#home"
      className="d-flex align-items-center gap-2 text-decoration-none"
    >
      <span
        className="icon-badge bg-brand text-white"
        style={{ width: 40, height: 40 }}
      >
        <i className="bi bi-heart-pulse-fill" aria-hidden="true" />
      </span>
      <span className="d-flex flex-column align-items-start lh-1">
        <span className="d-block fs-4 fw-bold text-ink">CareMed</span>
        <span
          className="d-block text-uppercase tracking-wide-2 text-ink-muted fw-semibold"
          style={{ fontSize: "1rem" }}
        >
          Hospital
        </span>
      </span>
    </a>
  );
}

export default function SiteHeader({ onBookAppointment }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  const handleBookAppointment = () => {
    closeMenu();
    onBookAppointment();
  };

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        document.documentElement.style.setProperty(
          "--site-header-height",
          `${headerRef.current.offsetHeight}px`,
        );
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("mobile-nav-open", menuOpen);
    return () => document.body.classList.remove("mobile-nav-open");
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="site-header" ref={headerRef}>
      <Container fluid="xl">
        <div className="site-header-bar d-flex align-items-center justify-content-between py-2">
          <Logo />

          <nav className="d-none d-lg-flex align-items-center gap-4 mx-auto">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-link-brand small"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="btn btn-brand rounded-pill d-none d-lg-inline-flex align-items-center gap-2 px-4 py-2"
            onClick={onBookAppointment}
          >
            Book Appointment
            <i className="bi bi-arrow-right-short fs-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="mobile-nav-toggle d-lg-none"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <i
              className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </Container>

      <div
        id="mobile-nav-panel"
        className={`mobile-nav-panel${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className="mobile-nav-links">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link-brand"
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="btn btn-brand rounded-pill w-100 d-inline-flex align-items-center justify-content-center gap-2 py-2"
          onClick={handleBookAppointment}
        >
          Book Appointment
          <i className="bi bi-arrow-right-short fs-5" aria-hidden="true" />
        </button>
      </div>

      <button
        type="button"
        className={`mobile-nav-backdrop${menuOpen ? " is-open" : ""}`}
        aria-label="Close menu"
        onClick={closeMenu}
        tabIndex={menuOpen ? 0 : -1}
      />
    </header>
  );
}
