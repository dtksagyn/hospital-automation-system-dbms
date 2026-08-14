import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDoctorAuth } from "../../context/DoctorAuthContext";
import "../../components/Auth/AuthPage.css";

export default function DoctorLoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useDoctorAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/doctor/dashboard", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login({ email, password, remember });
      navigate("/doctor/dashboard", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page d-flex align-items-center justify-content-center min-vh-100 px-3 py-5">
      <div className="auth-card p-4 p-sm-5 w-100" style={{ maxWidth: 420 }}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <span className="auth-brand" aria-hidden="true">
            <i className="bi bi-heart-pulse-fill" aria-hidden="true" />
          </span>
          <div>
            <h1 className="h5 mb-0 fw-bold">Doctor Sign In</h1>
            <p className="mb-0 small text-muted-soft">
              Access your CareMed doctor dashboard
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small mb-4" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label
              htmlFor="doctor-email"
              className="form-label fw-medium small"
            >
              Email address
            </label>
            <input
              id="doctor-email"
              type="email"
              className="form-control py-2"
              placeholder="doctor@caremed.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="mb-2">
            <label
              htmlFor="doctor-password"
              className="form-label fw-medium small mb-0"
            >
              Password
            </label>
            <div className="input-group mt-1">
              <input
                id="doctor-password"
                type={showPassword ? "text" : "password"}
                className="form-control py-2"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                disabled={submitting}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={submitting}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-check mb-4 mt-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="doctor-remember"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              disabled={submitting}
            />
            <label
              className="form-check-label small text-muted-soft"
              htmlFor="doctor-remember"
            >
              Keep me signed in
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-brand w-100 py-2 fw-semibold"
            disabled={submitting}
          >
            {submitting ? "Signing in..." : "Sign in to Dashboard"}
          </button>
        </form>

        <p className="text-center small text-muted-soft mt-4 mb-0">
          Need the patient portal?{" "}
          <Link to="/login" className="auth-link">
            Sign in as a patient
          </Link>
        </p>
      </div>
    </main>
  );
}
