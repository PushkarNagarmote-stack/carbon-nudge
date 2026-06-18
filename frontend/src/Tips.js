import React, { useState } from "react";

function Tips({ log, totalCo2 }) {
  const [loading, setLoading] = useState(false);
  const [aiTips, setAiTips] = useState(null);
  const [error, setError] = useState("");

  // const staticTips = [
//     { icon: "🚲", color: "#4edea3", title: "Cycle Short Distances", desc: "Replacing car trips under 5km with cycling saves ~1.2 kg CO₂ per trip." },
//     { icon: "🥗", color: "#ff9f43", title: "Try Meatless Mondays", desc: "One plant-based day per week can save up to 52 kg CO₂ per year." },
//     { icon: "💡", color: "#ffd32a", title: "Switch to LED Bulbs", desc: "LEDs use 75% less energy than incandescent bulbs and last 25x longer." },
//     { icon: "🧺", color: "#54a0ff", title: "Wash Clothes in Cold Water", desc: "90% of a washing machine's energy goes to heating water. Go cold!" },
//     { icon: "🔌", color: "#ff6b6b", title: "Unplug Idle Devices", desc: "Standby power can account for 10% of your home electricity use." },
//     { icon: "🛒", color: "#a29bfe", title: "Buy Local Produce", desc: "Local food travels less distance, reducing transport emissions significantly." },
// ];

  const getAiTips = async () => {
    setLoading(true);
    setError("");
    setAiTips(null);

    const context = log.length > 0
      ? `The user has logged: ${log.map(e => `${e.activity} (${e.co2_kg} kg CO₂)`).join(", ")}. Total today: ${totalCo2.toFixed(2)} kg CO₂.`
      : "The user hasn't logged any activities yet.";

    try {
      const response = await fetch("http://127.0.0.1:5000/api/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context })
      });
      const parsed = await response.json();
      setAiTips(parsed);
    } catch (e) {
      setError("Couldn't load AI tips. Please try again.");
    }
    setLoading(false);
  };

  const displayTips = aiTips || [];

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto", fontFamily: "'Inter', sans-serif" }}>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glowPulse { 0%, 100% { box-shadow: 0 0 0 rgba(78,222,163,0); } 50% { box-shadow: 0 0 18px rgba(78,222,163,0.25); } }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div style={{ width: "40px", height: "40px", background: "rgba(78,222,163,0.12)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>💡</div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#e5e2e1", letterSpacing: "-0.01em" }}>Sustainability Tips</h1>
        </div>
        <p style={{ color: "rgba(187,202,191,0.6)", fontSize: "14px", marginLeft: "52px" }}>
          {log.length > 0 ? `Based on your ${log.length} logged activities today` : "General tips to reduce your footprint"}
        </p>
      </div>

      {/* AI Button */}
      <button
        onClick={getAiTips}
        disabled={loading}
        style={{ width: "100%", padding: "14px", background: loading ? "rgba(78,222,163,0.1)" : "linear-gradient(135deg, #4edea3, #10b981)", color: loading ? "#4edea3" : "#003824", fontSize: "15px", fontWeight: 700, border: loading ? "1px solid rgba(78,222,163,0.3)" : "none", borderRadius: "12px", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Inter',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "24px", transition: "all 0.3s", boxShadow: loading ? "none" : "0 0 20px rgba(78,222,163,0.25)" }}
      >
        {loading ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".3"/><path d="M21 12a9 9 0 00-9-9"/></svg>
            Getting personalized tips...
          </>
        ) : (
          <>
            <span style={{ fontSize: "18px" }}>✨</span>
            {aiTips ? "Refresh AI Tips" : "Get AI-Personalized Tips"}
          </>
        )}
      </button>

      {error && (
        <div style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#ff6b6b", fontSize: "14px" }}>
          {error}
        </div>
      )}

      {/* Section label */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: aiTips ? "#4edea3" : "rgba(187,202,191,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", transition: "color 0.3s" }}>
          {aiTips ? "✨ Personalized for you" : "General Tips"}
        </span>
        <div style={{ flex: 1, height: "1px", background: aiTips ? "rgba(78,222,163,0.2)" : "rgba(255,255,255,0.05)", transition: "background 0.3s" }} />
      </div>

      {/* Tips Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {displayTips.map((tip, i) => (
          <div
            key={`${aiTips ? "ai" : "static"}-${i}`}
            style={{
              background: aiTips ? "rgba(78,222,163,0.04)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${aiTips ? "rgba(78,222,163,0.2)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
              cursor: "default",
              animation: `fadeSlideIn 0.45s ease forwards, ${aiTips ? "glowPulse 2s ease-in-out 0.5s 2" : "none"}`,
              animationDelay: `${i * 0.15}s`,
              opacity: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = aiTips ? "rgba(78,222,163,0.08)" : "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = aiTips ? "rgba(78,222,163,0.04)" : "rgba(255,255,255,0.03)"; }}
          >
            <div style={{ width: "44px", height: "44px", background: `${tip.color || "#4edea3"}20`, border: `1px solid ${tip.color || "#4edea3"}40`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
              {tip.emoji || tip.icon}
            </div>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#e5e2e1", marginBottom: "4px" }}>{tip.title}</p>
              <p style={{ fontSize: "13px", color: "rgba(187,202,191,0.7)", lineHeight: 1.6 }}>{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div style={{ marginTop: "28px", padding: "16px", background: "rgba(78,222,163,0.04)", border: "1px solid rgba(78,222,163,0.1)", borderRadius: "12px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <span style={{ fontSize: "18px", flexShrink: 0 }}>🌱</span>
        <p style={{ fontSize: "13px", color: "rgba(187,202,191,0.6)", lineHeight: 1.6 }}>
          Small consistent changes add up. Even reducing your footprint by 10% can save hundreds of kg of CO₂ per year.
        </p>
      </div>
    </div>
  );
}

export default Tips;