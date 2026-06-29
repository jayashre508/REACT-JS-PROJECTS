import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Zap, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import Logo from "../components/Logo";

const demoCredentials = [
  { label: "Product Lead", email: "sarah@trackflow.io",  password: "demo123", color: "#3b82f6", initials: "SC" },
  { label: "Frontend Dev", email: "alex@trackflow.io",   password: "demo123", color: "#8b5cf6", initials: "AR" },
  { label: "Admin",        email: "admin@trackflow.io",  password: "admin",   color: "#10b981", initials: "AD" },
];

const features = [
  "Kanban board with drag & drop",
  "Real-time analytics dashboard",
  "Sprint planning & tracking",
  "Team workload management",
  "Defect lifecycle tracking",
  "Contribution heatmaps",
];

const orbs = [
  { size: 420, top: "-120px", left: "-120px", color: "#6366f1", dur: "12s", anim: "orb1" },
  { size: 320, bottom: "-80px", right: "-80px", color: "#8b5cf6", dur: "16s", anim: "orb2" },
  { size: 260, top: "40%",  left: "35%",  color: "#3b82f6", dur: "14s", anim: "orb3" },
  { size: 180, top: "20%",  right: "10%", color: "#06b6d4", dur: "10s", anim: "orb1" },
];

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 3 + 1,
  dur: `${Math.random() * 12 + 8}s`,
  delay: `${Math.random() * 10}s`,
}));

export default function Login() {
  const { login, demoLogin, loginError, isLoading } = useAuthStore();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  const fillDemo = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#080b14", overflow: "hidden" }}>

      {/* ── Left Panel ── */}
      <div style={{
        display: "none", flex: "0 0 52%", position: "relative",
        flexDirection: "column", justifyContent: "space-between",
        padding: "48px 56px", overflow: "hidden",
        background: "linear-gradient(145deg, #080b14 0%, #0f0c29 40%, #1a1560 100%)",
      }} className="lg-flex">

        {/* Animated orbs */}
        {orbs.map((o, i) => (
          <div key={i} style={{
            position: "absolute",
            width: o.size, height: o.size,
            top: o.top, left: o.left, bottom: o.bottom, right: o.right,
            borderRadius: "50%",
            background: `radial-gradient(circle at 40% 40%, ${o.color}55, ${o.color}11, transparent 70%)`,
            animation: `${o.anim} ${o.dur} ease-in-out infinite`,
            filter: "blur(1px)",
          }} />
        ))}

        {/* Floating particles */}
        {particles.map((p) => (
          <div key={p.id} style={{
            position: "absolute",
            left: p.left, bottom: "-10px",
            width: p.size, height: p.size,
            borderRadius: "50%",
            background: "rgba(165,180,252,0.6)",
            animation: `particleDrift ${p.dur} ${p.delay} linear infinite`,
          }} />
        ))}

        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />

        {/* Noise texture */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }} />

        {/* Logo */}
        <div className="anim-fade-in-down delay-100" style={{ position: "relative", zIndex: 2 }}>
          <Logo size={44} textSize="text-2xl" />
        </div>

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="anim-fade-in-up delay-200" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: 999, padding: "6px 14px", marginBottom: 24,
          }}>
            <Sparkles size={12} style={{ color: "#a78bfa" }} />
            <span style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600 }}>Modern defect & task tracking</span>
          </div>

          <h1 className="anim-fade-in-up delay-300" style={{
            fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 800,
            color: "#fff", lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.02em",
          }}>
            Ship better software,<br />
            <span className="shimmer-text">faster than ever.</span>
          </h1>

          <p className="anim-fade-in-up delay-400" style={{
            color: "rgba(165,180,252,0.65)", fontSize: 15, lineHeight: 1.7,
            marginBottom: 36, maxWidth: 380,
          }}>
            TrackFlow gives your team a single source of truth — from bug discovery to deployment.
          </p>

          <div className="anim-fade-in-up delay-500" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px" }}>
            {features.map((f, i) => (
              <div key={f} className={`anim-fade-in-up delay-${500 + i * 50}`} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle size={13} style={{ color: "#34d399", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "rgba(165,180,252,0.7)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="anim-fade-in-up delay-700" style={{
          position: "relative", zIndex: 2,
          display: "flex", gap: 40,
          paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.07)",
        }}>
          {[["15+", "Tasks tracked"], ["6", "Team members"], ["3", "Active sprints"]].map(([val, label]) => (
            <div key={label}>
              <p style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{val}</p>
              <p style={{ fontSize: 12, color: "rgba(165,180,252,0.5)", marginTop: 2 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "32px 24px", overflowY: "auto",
        background: "linear-gradient(160deg, #0d0f1a 0%, #111827 100%)",
        position: "relative",
      }}>

        {/* Subtle bg glow */}
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="anim-scale-in delay-100" style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>

          {/* Mobile logo */}
          <div className="lg-hidden anim-fade-in-down" style={{ marginBottom: 32, display: "flex", justifyContent: "center" }}>
            <Logo size={40} textSize="text-2xl" />
          </div>

          {/* Card */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24, padding: 36,
            backdropFilter: "blur(20px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}>

            <div className="anim-fade-in-up delay-150" style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>Welcome back</h2>
              <p style={{ fontSize: 13, color: "rgba(148,163,184,0.7)", marginTop: 6 }}>Sign in to your TrackFlow workspace</p>
            </div>

            {/* Error */}
            {loginError && (
              <div className="anim-fade-in" style={{
                marginBottom: 16, padding: "12px 16px", borderRadius: 12,
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                fontSize: 13, color: "#fca5a5", fontWeight: 500,
              }}>
                {loginError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Email */}
              <div className="anim-fade-in-up delay-200">
                <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(148,163,184,0.8)", display: "block", marginBottom: 8, letterSpacing: "0.04em" }}>
                  EMAIL ADDRESS
                </label>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: focusedField === "email" ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${focusedField === "email" ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 12, padding: "11px 14px",
                  boxShadow: focusedField === "email" ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
                  transition: "all 0.2s",
                }}>
                  <Mail size={15} style={{ color: focusedField === "email" ? "#818cf8" : "rgba(148,163,184,0.5)", flexShrink: 0, transition: "color 0.2s" }} />
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@company.com"
                    style={{
                      background: "transparent", border: "none", outline: "none",
                      fontSize: 14, color: "#f1f5f9", flex: 1,
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="anim-fade-in-up delay-250">
                <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(148,163,184,0.8)", display: "block", marginBottom: 8, letterSpacing: "0.04em" }}>
                  PASSWORD
                </label>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: focusedField === "pass" ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${focusedField === "pass" ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 12, padding: "11px 14px",
                  boxShadow: focusedField === "pass" ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
                  transition: "all 0.2s",
                }}>
                  <Lock size={15} style={{ color: focusedField === "pass" ? "#818cf8" : "rgba(148,163,184,0.5)", flexShrink: 0, transition: "color 0.2s" }} />
                  <input
                    type={showPass ? "text" : "password"} required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("pass")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    style={{
                      background: "transparent", border: "none", outline: "none",
                      fontSize: 14, color: "#f1f5f9", flex: 1,
                    }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "rgba(148,163,184,0.5)", display: "flex", padding: 0,
                    transition: "color 0.2s",
                  }}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit" disabled={isLoading}
                className="anim-fade-in-up delay-300"
                style={{
                  width: "100%", padding: "13px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed, #6366f1)",
                  backgroundSize: "200% 200%",
                  color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 24px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "all 0.2s", opacity: isLoading ? 0.7 : 1,
                  animation: "gradientShift 4s ease infinite",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.6), inset 0 1px 0 rgba(255,255,255,0.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.15)"; }}
              >
                {isLoading ? (
                  <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                ) : (
                  <><span>Sign in</span><ArrowRight size={15} /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="anim-fade-in-up delay-350" style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              <span style={{ fontSize: 11, color: "rgba(148,163,184,0.5)", fontWeight: 500 }}>or try a demo account</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            </div>

            {/* Demo accounts */}
            <div className="anim-fade-in-up delay-400" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {demoCredentials.map((cred) => (
                <button
                  key={cred.email}
                  onClick={() => fillDemo(cred)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 14px", borderRadius: 12,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.transform = "translateX(3px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateX(0)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: `linear-gradient(135deg, ${cred.color}, ${cred.color}99)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: "#fff",
                    }}>{cred.initials}</div>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{cred.label}</p>
                      <p style={{ fontSize: 11, color: "rgba(148,163,184,0.5)" }}>{cred.email}</p>
                    </div>
                  </div>
                  <ArrowRight size={13} style={{ color: "rgba(148,163,184,0.3)" }} />
                </button>
              ))}
            </div>

            {/* Quick demo */}
            <button
              onClick={demoLogin} disabled={isLoading}
              className="anim-fade-in-up delay-500"
              style={{
                width: "100%", marginTop: 12, padding: "11px",
                borderRadius: 12, border: "1px dashed rgba(99,102,241,0.3)",
                background: "transparent", fontSize: 13, color: "rgba(148,163,184,0.6)",
                cursor: "pointer", fontWeight: 500, transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)"; e.currentTarget.style.color = "#818cf8"; e.currentTarget.style.background = "rgba(99,102,241,0.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.color = "rgba(148,163,184,0.6)"; e.currentTarget.style.background = "transparent"; }}
            >
              <Zap size={13} style={{ color: "#fbbf24" }} />
              Quick demo — enter as Sarah Chen
            </button>
          </div>

          <p className="anim-fade-in delay-600" style={{ textAlign: "center", fontSize: 12, color: "rgba(148,163,184,0.35)", marginTop: 20 }}>
            TrackFlow v1.0 · Built for agile teams
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .lg-flex { display: flex !important; }
          .lg-hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
