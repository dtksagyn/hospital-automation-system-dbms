import { useState } from "react"

type Mode = "signin" | "signup"

export default function App() {
  const [mode, setMode] = useState<Mode>("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitted, setSubmitted] = useState<string | null>(null)

  const isSignup = mode === "signup"

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(
      `${isSignup ? "Account created" : "Signed in"} as ${email || "your account"}`,
    )
  }

  function switchMode(next: Mode) {
    setMode(next)
    setSubmitted(null)
  }

  return (
    <main className="d-flex align-items-center justify-content-center min-vh-100 px-3 py-5">
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

        {submitted && (
          <div
            className="alert alert-success py-2 small mb-4"
            role="status"
          >
            {submitted}
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
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
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
                defaultChecked
              />
              <label className="form-check-label small text-muted-soft" htmlFor="remember">
                Keep me signed in
              </label>
            </div>
          )}

          <button type="submit" className="btn btn-brand w-100 py-2 fw-semibold mt-3">
            {isSignup ? "Create account" : "Sign in"}
          </button>
        </form>

        <div className="auth-divider my-4">or</div>

        <button
          type="button"
          className="btn btn-outline-secondary w-100 py-2 fw-medium"
        >
          Continue with SSO
        </button>

        <p className="text-center small text-muted-soft mt-4 mb-0">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <a
            href="#"
            className="auth-link"
            onClick={(e) => {
              e.preventDefault()
              switchMode(isSignup ? "signin" : "signup")
            }}
          >
            {isSignup ? "Sign in" : "Sign up"}
          </a>
        </p>
      </div>
    </main>
  )
}
