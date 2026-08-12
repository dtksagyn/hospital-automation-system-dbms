import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser, registerUser } from "../../services/api";
import { filterNameInput } from "../../utils/inputConstraints";
import "./AuthPage.css";

export default function AuthPage() {
  const navigate = useNavigate();
  const { setUser, isAuthenticated, loading } = useAuth();
  const [mode, setMode] = useState("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === "signup";

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isSignup && !fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setSubmitting(true);

    try {
      const data = isSignup
        ? await registerUser({ fullName: fullName.trim(), email, password })
        : await loginUser({ email, password, remember });

      setUser(data.user);
      setSuccess(data.message);
      navigate("/", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  function switchMode(next) {
    setMode(next);
    setError("");
    setSuccess("");
    setFullName("");
    setPassword("");
  }

  return (
    <main className="auth-page d-flex align-items-center justify-content-center min-vh-100 px-3 py-5">
      <div className="auth-card p-4 p-sm-5 w-100" style={{ maxWidth: 420 }}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <span className="auth-brand" aria-hidden="true">
            A
          </span>
          <div>
            <h1 className="h5 mb-0 fw-bold">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mb-0 small text-muted-soft">
              {isSignup
                ? "Start your free account in seconds"
                : "Sign in to continue to your dashboard"}
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger py-2 small mb-4" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success py-2 small mb-4" role="status">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {isSignup && (
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-medium small">
                Full name
              </label>
              <input
                id="name"
                type="text"
                className="form-control py-2"
                placeholder="Jane Doe"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(filterNameInput(e.target.value))}
                inputMode="text"
                required
                disabled={submitting}
              />
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-medium small">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="form-control py-2"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <label htmlFor="password" className="form-label fw-medium small mb-0">
                Password
              </label>
              {!isSignup && (
                <a href="#" className="auth-link small">
                  Forgot?
                </a>
              )}
            </div>
            <div className="input-group mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-control py-2"
                placeholder="••••••••"
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                disabled={submitting}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={submitting}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {!isSignup && (
            <div className="form-check mb-4 mt-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={submitting}
              />
              <label className="form-check-label small text-muted-soft" htmlFor="remember">
                Keep me signed in
              </label>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-brand w-100 py-2 fw-semibold mt-3"
            disabled={submitting}
          >
            {submitting
              ? isSignup
                ? "Creating account..."
                : "Signing in..."
              : isSignup
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <div className="auth-divider my-4">or</div>

        <button
          type="button"
          className="btn btn-outline-secondary w-100 py-2 fw-medium"
          disabled
        >
          Continue with SSO
        </button>

        <p className="text-center small text-muted-soft mt-4 mb-0">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <a
            href="#"
            className="auth-link"
            onClick={(e) => {
              e.preventDefault();
              if (!submitting) {
                switchMode(isSignup ? "signin" : "signup");
              }
            }}
          >
            {isSignup ? "Sign in" : "Sign up"}
          </a>
        </p>
      </div>
    </main>
  );
}
