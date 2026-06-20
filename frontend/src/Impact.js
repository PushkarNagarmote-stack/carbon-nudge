import React from "react";

function Impact({ onGoLogin, onGoSignup, onGoLanding, onGoHowItWorks }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", color: "#e5e2e1", fontFamily: "'Inter',sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        .imp-glass { background: rgba(32,31,31,0.4); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.1); }
        .imp-glow-green { box-shadow: 0 0 20px rgba(78,222,163,0.3); }
        .imp-glow-text { text-shadow: 0 0 12px rgba(78,222,163,0.6); }
        .imp-nav-link { background: none; border: none; cursor: pointer; font-family: 'Inter',sans-serif; }
        .imp-card:hover { background: rgba(255,255,255,0.05); transform: translateY(-4px); }
        .imp-card { transition: all 0.3s; }
        @media (max-width: 768px) { .imp-nav-links { display: none !important; } }
        @media (min-width: 769px) { .imp-hamburger { display: none !important; } }
      `}</style>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(10,10,10,0.8)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", height: "64px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button className="imp-nav-link" onClick={onGoLanding} style={{ fontSize: "20px", fontWeight: 800, color: "#4edea3" }}>Carbon Nudge</button>
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }} className="imp-nav-links">
            <button className="imp-nav-link" onClick={onGoLanding} style={{ color: "#bbcabf", fontWeight: 600, fontSize: "14px" }}>Features</button>
            <button className="imp-nav-link" onClick={onGoHowItWorks} style={{ color: "#bbcabf", fontWeight: 600, fontSize: "14px" }}>How it Works</button>
            <button className="imp-nav-link" style={{ color: "#4edea3", fontWeight: 700, fontSize: "14px", borderBottom: "2px solid #4edea3", paddingBottom: "4px" }}>Impact</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button className="imp-hamburger" aria-label="Open menu" onClick={() => { const m = document.getElementById('imp-mobile-menu'); m.style.display = m.style.display === 'flex' ? 'none' : 'flex'; }} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "#fff", fontSize: "20px", cursor: "pointer", padding: "4px 10px", fontFamily: "'Inter',sans-serif" }}>☰</button>
            <button onClick={onGoLogin} className="imp-nav-link" style={{ padding: "8px 20px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "13px", fontWeight: 600 }}>Login</button>
            <button onClick={onGoSignup} className="imp-nav-link" style={{ padding: "8px 20px", borderRadius: "999px", background: "#4edea3", color: "#003824", fontSize: "13px", fontWeight: 700, boxShadow: "0 0 20px rgba(78,222,163,0.4)" }}>Get Started</button>
          </div>
        </div>
        <div id="imp-mobile-menu" style={{ display: "none", flexDirection: "column", background: "rgba(10,10,10,0.95)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "16px 24px", gap: "16px" }}>
          <button className="imp-nav-link" onClick={onGoLanding} style={{ color: "#bbcabf", fontWeight: 600, fontSize: "15px", textAlign: "left" }}>Features</button>
          <button className="imp-nav-link" onClick={onGoHowItWorks} style={{ color: "#bbcabf", fontWeight: 600, fontSize: "15px", textAlign: "left" }}>How it Works</button>
          <button className="imp-nav-link" style={{ color: "#4edea3", fontWeight: 700, fontSize: "15px", textAlign: "left" }}>Impact</button>
        </div>
      </nav>

      <main style={{ paddingTop: "128px", paddingBottom: "48px", maxWidth: "1280px", margin: "0 auto", padding: "128px 24px 48px" }}>
        <section style={{ marginBottom: "48px" }}>
          <h1 style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 800, marginBottom: "16px", position: "relative", display: "inline-block" }}>
            Impact
            <span style={{ position: "absolute", bottom: "2px", left: 0, width: "100%", height: "4px", background: "#4edea3", filter: "blur(2px)" }} />
          </h1>
          <p style={{ fontSize: "18px", color: "#bbcabf", maxWidth: "640px", lineHeight: 1.6 }}>
            Every log. Every nudge. Every choice. It all adds up. Here's the scale of individual agency in the face of global climate challenges.
          </p>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: "24px", marginBottom: "48px" }}>
          {[
            { icon: "🌍", value: "4.5 kg", label: "Global average daily CO\u2082 per person" },
            { icon: "🔥", value: "27 kg", label: "CO\u2082 from just one beef serving" },
            { icon: "✈️", value: "2.5 t", label: "Avg annual CO\u2082 in low-impact nations" },
          ].map((s, i) => (
            <div key={i} className="imp-glass imp-card" style={{ padding: "24px", borderRadius: "16px" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>{s.icon}</div>
              <div className="imp-glow-text" style={{ fontSize: "36px", fontWeight: 800, color: "#4edea3", marginBottom: "8px" }}>{s.value}</div>
              <p style={{ fontSize: "11px", color: "#bbcabf", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</p>
            </div>
          ))}
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: "24px", marginBottom: "48px" }}>
          {[
            { icon: "🌳", title: "The Tree Offset", desc: "1 tree absorbs ~21 kg CO\u2082 per year. Skipping beef once a week for a year saves the equivalent of planting 66 trees.", tag: "Biological Equivalent" },
            { icon: "🚗", title: "Commuter Shift", desc: "Driving 1 km emits 0.21 kg CO\u2082. Switching to train for your daily commute could save 400+ kg CO\u2082 per year.", tag: "Mobility Impact" },
            { icon: "⚡", title: "Energy Nudge", desc: "10 units of electricity = 8.2 kg CO\u2082. Reducing one hour of AC usage daily saves ~150 kg CO\u2082 per year.", tag: "Residential Efficiency" },
          ].map((c, i) => (
            <div key={i} className="imp-glass imp-card" style={{ padding: "24px", borderRadius: "16px", borderLeft: "4px solid rgba(78,222,163,0.4)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "22px" }}>{c.icon}</span>
                  <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>{c.title}</h2>
                </div>
                <p style={{ fontSize: "14px", color: "#bbcabf", lineHeight: 1.6 }}>{c.desc}</p>
              </div>
              <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: "11px", color: "#4edea3", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{c.tag}</span>
              </div>
            </div>
          ))}
        </section>

        <section style={{ marginBottom: "48px" }}>
          <div className="imp-glass" style={{ padding: "40px", borderRadius: "20px", border: "1px solid rgba(78,222,163,0.2)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "32px" }}>
            <div style={{ flex: "2", minWidth: "260px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "12px", color: "#fff" }}>Collective Power</h2>
              <p style={{ fontSize: "17px", color: "#bbcabf", lineHeight: 1.7 }}>
                If every Carbon Nudge user reduces their footprint by just <span style={{ color: "#4edea3", fontWeight: 700 }}>10%</span>, together we eliminate thousands of tonnes of CO\u2082 every single year.
              </p>
            </div>
            <div style={{ flex: "1", textAlign: "center", minWidth: "120px" }}>
              <div className="imp-glow-green" style={{ display: "inline-block", padding: "24px", borderRadius: "50%", background: "rgba(78,222,163,0.1)", border: "1px solid rgba(78,222,163,0.3)", fontSize: "40px" }}>👥</div>
            </div>
          </div>
        </section>

        <section className="imp-glass" style={{ padding: "40px", borderRadius: "20px", marginBottom: "48px" }}>
          <h3 style={{ fontSize: "20px", fontWeight: 700, textAlign: "center", marginBottom: "48px" }}>Where do you sit today?</h3>
          <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative", paddingTop: "40px" }}>
            <div style={{ height: "10px", width: "100%", borderRadius: "999px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "65%", background: "linear-gradient(90deg, #ff6b6b, #ffb95f, #4edea3)", boxShadow: "0 0 15px rgba(78,222,163,0.4)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "12px", color: "#ff6b6b", fontWeight: 700, marginBottom: "4px" }}>Global Average</p>
                <p style={{ fontSize: "13px", color: "#bbcabf" }}>4.5 kg/day</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "12px", color: "#ffb95f", fontWeight: 700, marginBottom: "4px" }}>Target Goal</p>
                <p style={{ fontSize: "13px", color: "#bbcabf" }}>3.5 kg/day</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "12px", color: "#4edea3", fontWeight: 700, marginBottom: "4px" }}>Ideal Lifestyle</p>
                <p style={{ fontSize: "13px", color: "#bbcabf" }}>2.0 kg/day</p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ textAlign: "center", padding: "24px 0" }}>
          <button onClick={onGoSignup} className="imp-glow-green" style={{ background: "#4edea3", color: "#003824", padding: "20px 48px", borderRadius: "999px", fontWeight: 700, fontSize: "18px", border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
            Start Tracking Your Impact →
          </button>
        </section>
      </main>

      <footer style={{ padding: "40px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "#0e0e0e", textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: "#bbcabf" }}>© 2026 Carbon Nudge. Engineering a sustainable future.</p>
      </footer>
    </div>
  );
}

export default Impact;