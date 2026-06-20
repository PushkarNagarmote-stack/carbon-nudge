import React from "react";

function HowItWorks({ onGoLogin, onGoSignup, onGoLanding, onGoImpact }) {
  const steps = [
    { n: 1, icon: "📝", title: "Create Your Account", desc: "Sign up in seconds. Your data is stored securely." },
    { n: 2, icon: "🏷️", title: "Log an Activity", desc: "Pick Food, Travel, or Energy. Enter the quantity." },
    { n: 3, icon: "⚡", title: "Instant CO\u2082 Calculation", desc: "Multiplied by real-world emission factors." },
    { n: 4, icon: "🤖", title: "Get Your AI Nudge", desc: "Groq's LLaMA 3.3 AI gives you a personalised tip." },
    { n: 5, icon: "📊", title: "Track & Improve", desc: "Real-time dashboard, streaks, and badges." },
  ];

  const foodFactors = [
    ["Beef", "27.0", "kg/serving"],
    ["Chicken", "6.9", "kg/serving"],
    ["Rice", "2.7", "kg/serving"],
    ["Vegetables", "0.5", "kg/serving"],
  ];
  const travelFactors = [
    ["Car", "0.21", "kg/km"],
    ["Bus", "0.089", "kg/km"],
    ["Train", "0.041", "kg/km"],
    ["Flight", "0.255", "kg/km"],
  ];
  const energyFactors = [
    ["Electricity", "0.82", "kg/unit"],
    ["LPG", "1.51", "kg/unit"],
  ];

  const FactorCard = ({ icon, title, rows }) => (
    <div className="hiw-glass hiw-glow-border" style={{ padding: "24px", borderRadius: "16px", transition: "all 0.3s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <span style={{ fontSize: "26px" }}>{icon}</span>
        <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#fff" }}>{title}</h3>
      </div>
      <div>
        {rows.map(([name, val, unit], i) => (
          <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <span style={{ color: "#bbcabf", fontSize: "15px" }}>{name}</span>
            <span style={{ fontWeight: 700, color: "#4edea3", fontSize: "15px" }}>{val} <small style={{ fontSize: "10px", color: "#bbcabf" }}>{unit}</small></span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", color: "#e5e2e1", fontFamily: "'Inter',sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        .hiw-glass { background: rgba(32,31,31,0.4); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.1); }
        .hiw-glow-border:hover { border-color: rgba(78,222,163,0.4); box-shadow: 0 0 20px rgba(78,222,163,0.1); transform: translateY(-4px); }
        .hiw-nav-link { background: none; border: none; cursor: pointer; font-family: 'Inter',sans-serif; }
        .hiw-corner-glow { position: fixed; width: 40vw; height: 40vw; border-radius: 50%; pointer-events: none; z-index: 0; }
        @media (max-width: 768px) { .hiw-nav-links { display: none !important; } }
        @media (min-width: 769px) { .hiw-hamburger { display: none !important; } }
      `}</style>

      <div className="hiw-corner-glow" style={{ top: "-10vw", left: "-10vw", background: "radial-gradient(circle, rgba(78,222,163,0.08) 0%, transparent 70%)" }} />
      <div className="hiw-corner-glow" style={{ bottom: "-10vw", right: "-10vw", background: "radial-gradient(circle, rgba(78,222,163,0.08) 0%, transparent 70%)" }} />

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(10,10,10,0.8)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", height: "64px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button className="hiw-nav-link" onClick={onGoLanding} style={{ fontSize: "20px", fontWeight: 800, color: "#4edea3" }}>Carbon Nudge</button>
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }} className="hiw-nav-links">
            <button className="hiw-nav-link" onClick={onGoLanding} style={{ color: "#bbcabf", fontWeight: 600, fontSize: "14px" }}>Features</button>
            <button className="hiw-nav-link" style={{ color: "#4edea3", fontWeight: 700, fontSize: "14px", borderBottom: "2px solid #4edea3", paddingBottom: "4px" }}>How it Works</button>
            <button className="hiw-nav-link" onClick={onGoImpact} style={{ color: "#bbcabf", fontWeight: 600, fontSize: "14px" }}>Impact</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button className="hiw-hamburger" aria-label="Open menu" onClick={() => { const m = document.getElementById('hiw-mobile-menu'); m.style.display = m.style.display === 'flex' ? 'none' : 'flex'; }} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "#fff", fontSize: "20px", cursor: "pointer", padding: "4px 10px", fontFamily: "'Inter',sans-serif" }}>☰</button>
            <button onClick={onGoLogin} className="hiw-nav-link" style={{ padding: "8px 20px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "13px", fontWeight: 600 }}>Login</button>
            <button onClick={onGoSignup} className="hiw-nav-link" style={{ padding: "8px 20px", borderRadius: "999px", background: "#4edea3", color: "#003824", fontSize: "13px", fontWeight: 700, boxShadow: "0 0 20px rgba(78,222,163,0.4)" }}>Get Started</button>
          </div>
        </div>
        <div id="hiw-mobile-menu" style={{ display: "none", flexDirection: "column", background: "rgba(10,10,10,0.95)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "16px 24px", gap: "16px" }}>
          <button className="hiw-nav-link" onClick={onGoLanding} style={{ color: "#bbcabf", fontWeight: 600, fontSize: "15px", textAlign: "left" }}>Features</button>
          <button className="hiw-nav-link" style={{ color: "#4edea3", fontWeight: 700, fontSize: "15px", textAlign: "left" }}>How it Works</button>
          <button className="hiw-nav-link" onClick={onGoImpact} style={{ color: "#bbcabf", fontWeight: 600, fontSize: "15px", textAlign: "left" }}>Impact</button>
        </div>
      </nav>

      <main style={{ position: "relative", zIndex: 1, paddingTop: "128px", paddingBottom: "48px", maxWidth: "1280px", margin: "0 auto", padding: "128px 24px 48px" }}>
        <section style={{ textAlign: "center", marginBottom: "64px" }}>
          <h1 style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 800, marginBottom: "16px", letterSpacing: "-0.02em" }}>
            The science of <span style={{ color: "#4edea3" }}>sustainability</span>.
          </h1>
          <p style={{ fontSize: "18px", color: "#bbcabf", maxWidth: "640px", margin: "0 auto", lineHeight: 1.6 }}>
            Calculate, analyze, and nudge your daily habits toward a carbon-neutral future using high-precision data and AI.
          </p>
        </section>

        <section style={{ marginBottom: "100px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "24px" }}>
            {steps.map((s) => (
              <div key={s.n} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#4edea3", color: "#003824", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "20px", marginBottom: "16px", boxShadow: "0 0 20px rgba(78,222,163,0.4)" }}>{s.n}</div>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{s.icon} {s.title}</h2>
                <p style={{ fontSize: "14px", color: "#bbcabf", lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "24px", borderLeft: "4px solid #4edea3", paddingLeft: "16px" }}>Our Emission Factors</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: "24px" }}>
            <FactorCard icon="🍖" title="Food" rows={foodFactors} />
            <FactorCard icon="🚗" title="Travel" rows={travelFactors} />
            <FactorCard icon="⚡" title="Energy" rows={energyFactors} />
          </div>
        </section>

        <section style={{ maxWidth: "900px", margin: "0 auto 48px" }}>
          <div className="hiw-glass" style={{ padding: "32px", borderRadius: "20px", borderLeft: "6px solid #4edea3", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "24px" }}>
            <div style={{ textAlign: "center", minWidth: "140px" }}>
              <div style={{ fontSize: "36px", fontWeight: 800, color: "#4edea3" }}>4.5</div>
              <div style={{ fontSize: "11px", color: "#bbcabf", textTransform: "uppercase", letterSpacing: "0.1em" }}>kg CO\u2082 / day</div>
            </div>
            <p style={{ flex: 1, color: "#e5e2e1", fontSize: "16px", lineHeight: 1.7, minWidth: "240px" }}>
              Your daily total is compared against the <span style={{ color: "#4edea3", fontWeight: 700 }}>global average of 4.5 kg CO\u2082 per day</span>. The progress bar and streak system update in real time based on your logs.
            </p>
          </div>
        </section>
      </main>

      <footer style={{ padding: "40px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "#0e0e0e", textAlign: "center" }}>
        <p style={{ fontSize: "12px", color: "#bbcabf" }}>© 2026 Carbon Nudge. Engineering a sustainable future.</p>
      </footer>
    </div>
  );
}

export default HowItWorks;