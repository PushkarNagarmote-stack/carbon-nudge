import React from "react";

function Landing({ onGoLogin, onGoSignup, onGoHowItWorks, onGoImpact }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", color: "#e5e2e1", fontFamily: "'Inter',sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
        .ln-glass { background: rgba(32,31,31,0.4); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.1); }
        .ln-glow-btn { box-shadow: 0 0 20px rgba(78,222,163,0.2); transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
        .ln-glow-btn:hover { box-shadow: 0 0 30px rgba(78,222,163,0.4); transform: translateY(-2px); }
        .ln-glow-border:hover { border-color: rgba(78,222,163,0.5); box-shadow: 0 0 20px rgba(78,222,163,0.05); }
        .ln-nav-link { position: relative; cursor: pointer; background: none; border: none; font-family: 'Inter',sans-serif; color: inherit; }
        .ln-nav-link::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background-color: #4edea3; transition: width 0.3s ease; }
        .ln-nav-link:hover::after { width: 100%; }
        .ln-bg-glow { background: radial-gradient(circle at 50% 50%, rgba(78,222,163,0.08) 0%, transparent 70%); }
        @media (max-width: 768px) { .ln-nav-desktop { display: none !important; } }
        @media (min-width: 769px) { .ln-hamburger { display: none !important; } }
      `}</style>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(10,10,10,0.8)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", height: "80px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(78,222,163,0.2)", border: "1px solid rgba(78,222,163,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🌿</div>
            <span style={{ fontSize: "20px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Carbon Nudge</span>
          </div>
          <div style={{ display: "flex", gap: "40px", alignItems: "center" }} className="ln-nav-desktop">
            <button className="ln-nav-link" style={{ color: "#fff", fontWeight: 600, fontSize: "14px" }}>Features</button>
            <button className="ln-nav-link" style={{ color: "#bbcabf", fontWeight: 600, fontSize: "14px" }} onClick={onGoHowItWorks}>How it Works</button>
            <button className="ln-nav-link" style={{ color: "#bbcabf", fontWeight: 600, fontSize: "14px" }} onClick={onGoImpact}>Impact</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button className="ln-hamburger" aria-label="Open menu" onClick={() => { const m = document.getElementById('ln-mobile-menu'); m.style.display = m.style.display === 'flex' ? 'none' : 'flex'; }} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "#fff", fontSize: "20px", cursor: "pointer", padding: "4px 10px", fontFamily: "'Inter',sans-serif" }}>☰</button>
            <button onClick={onGoLogin} style={{ color: "#fff", background: "none", border: "none", fontWeight: 600, fontSize: "14px", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>Login</button>
            <button onClick={onGoSignup} className="ln-glow-btn" style={{ background: "#4edea3", color: "#003824", padding: "10px 24px", borderRadius: "999px", fontWeight: 700, fontSize: "14px", border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>Get Started</button>
          </div>
        </div>
        <div id="ln-mobile-menu" style={{ display: "none", flexDirection: "column", background: "rgba(10,10,10,0.95)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "16px 24px", gap: "16px" }}>
          <button className="ln-nav-link" style={{ color: "#fff", fontWeight: 600, fontSize: "15px", textAlign: "left" }}>Features</button>
          <button className="ln-nav-link" style={{ color: "#bbcabf", fontWeight: 600, fontSize: "15px", textAlign: "left" }} onClick={onGoHowItWorks}>How it Works</button>
          <button className="ln-nav-link" style={{ color: "#bbcabf", fontWeight: 600, fontSize: "15px", textAlign: "left" }} onClick={onGoImpact}>Impact</button>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="ln-bg-glow" style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "128px", paddingBottom: "80px", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "25%", left: "-25%", width: "600px", height: "600px", background: "rgba(78,222,163,0.1)", borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "25%", right: "-25%", width: "600px", height: "600px", background: "rgba(174,198,255,0.05)", borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 10, maxWidth: "900px", margin: "0 auto", padding: "0 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "999px", background: "rgba(78,222,163,0.1)", border: "1px solid rgba(78,222,163,0.2)", color: "#4edea3", marginBottom: "40px" }}>
              <span style={{ fontSize: "16px" }}>✅</span>
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em" }}>AI-Powered Carbon Tracking</span>
            </div>
            <h1 style={{ fontSize: "clamp(40px, 7vw, 72px)", maxWidth: "800px", margin: "0 auto 32px", lineHeight: 1.1, fontWeight: 800, letterSpacing: "-0.03em", background: "linear-gradient(to bottom, #fff, rgba(255,255,255,0.6))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Engineering a <br />
              <span style={{ color: "#4edea3", WebkitTextFillColor: "#4edea3" }}>Sustainable Future</span>
            </h1>
            <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "#bbcabf", maxWidth: "560px", margin: "0 auto 48px", lineHeight: 1.6 }}>
              Carbon Nudge uses AI to track your emissions in real-time and deliver personalised nudges to help you build a greener lifestyle, one log at a time.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
              <button onClick={onGoSignup} className="ln-glow-btn" style={{ background: "#4edea3", color: "#003824", padding: "16px 40px", borderRadius: "12px", fontWeight: 700, fontSize: "17px", border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>Start Your Journey</button>
              <button onClick={onGoLogin} className="ln-glass" style={{ color: "#fff", padding: "16px 40px", borderRadius: "12px", fontWeight: 700, fontSize: "17px", cursor: "pointer", fontFamily: "'Inter',sans-serif", display: "flex", alignItems: "center", gap: "8px" }}>🚀 Try Demo</button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={{ padding: "100px 24px", maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <p style={{ color: "#4edea3", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", marginBottom: "16px" }}>Core Technology</p>
            <h2 style={{ fontSize: "clamp(28px,4vw,40px)", color: "#fff", fontWeight: 800, marginBottom: "20px", letterSpacing: "-0.02em" }}>Engineered for Impact</h2>
            <div style={{ height: "4px", width: "80px", background: "#4edea3", margin: "0 auto", borderRadius: "999px" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: "24px" }}>
            {[
              { icon: "🧠", title: "Real-time AI Tracking", desc: "Log your food, travel and energy activity and get instant, accurate CO\u2082 calculations powered by real emission factor data." },
              { icon: "⚡", title: "Smart Nudges", desc: "Get personalised daily tips and micro-actions from Groq's LLaMA 3.3 AI that reduce your CO\u2082 output without disrupting your lifestyle." },
              { icon: "🌍", title: "Track Your Progress", desc: "Compare your daily footprint to the global average, build streaks, earn badges, and review weekly trends over time." },
            ].map((f, i) => (
              <div key={i} className="ln-glass ln-glow-border" style={{ padding: "40px", borderRadius: "32px", transition: "all 0.3s", display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(78,222,163,0.1)", border: "1px solid rgba(78,222,163,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>{f.icon}</div>
                <div>
                  <h3 style={{ fontSize: "22px", color: "#fff", fontWeight: 800, marginBottom: "12px" }}>{f.title}</h3>
                  <p style={{ color: "#bbcabf", lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ padding: "100px 24px" }}>
          <div className="ln-glass" style={{ maxWidth: "1100px", margin: "0 auto", borderRadius: "48px", padding: "60px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: "380px", height: "380px", background: "rgba(78,222,163,0.05)", borderRadius: "50%", filter: "blur(100px)", marginRight: "-190px", marginTop: "-190px" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontSize: "clamp(28px,4vw,42px)", color: "#fff", fontWeight: 800, marginBottom: "24px" }}>Ready to make a nudge?</h2>
              <p style={{ color: "#bbcabf", fontSize: "18px", maxWidth: "560px", margin: "0 auto 40px", lineHeight: 1.6 }}>Start tracking your carbon footprint today and join the movement toward a better tomorrow.</p>
              <button onClick={onGoSignup} className="ln-glow-btn" style={{ background: "#4edea3", color: "#003824", padding: "20px 48px", borderRadius: "16px", fontWeight: 700, fontSize: "19px", border: "none", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>Get Started Now</button>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ padding: "60px 24px 40px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "#0e0e0e" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "24px", alignItems: "center" }}>
          <span style={{ fontSize: "16px", fontWeight: 800, color: "#4edea3" }}>Carbon Nudge</span>
          <p style={{ fontSize: "12px", color: "#bbcabf", letterSpacing: "0.05em" }}>© 2026 Carbon Nudge. Engineered for the Earth.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;