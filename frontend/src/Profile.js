import React, { useState } from "react";
import PropTypes from "prop-types";

function Profile({ log, totalCo2, streak, onLogout }) {
  const user = JSON.parse(localStorage.getItem("cn_current_user") || '{"name":"User","email":"user@email.com","joinedAt":"2024-01-01"}');
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updated = { ...user, name };
    localStorage.setItem("cn_current_user", JSON.stringify(updated));
    const users = JSON.parse(localStorage.getItem("cn_users") || "[]");
    const idx = users.findIndex(u => u.email === user.email);
    if (idx !== -1) { users[idx].name = name; localStorage.setItem("cn_users", JSON.stringify(users)); }
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setName(user.name);
  };

  const handleLogout = () => {
    localStorage.removeItem("cn_current_user");
    onLogout();
  };

  const badges = [
    { emoji: "🌱", label: "First Log", unlocked: log.length >= 1 },
    { emoji: "🔥", label: "3-Day Streak", unlocked: streak >= 3 },
    { emoji: "⚡", label: "Energy Saver", unlocked: log.some(e => e.category === "energy") },
    { emoji: "🚴", label: "Green Travel", unlocked: log.some(e => e.category === "travel") },
    { emoji: "🥗", label: "Eco Eater", unlocked: log.some(e => e.category === "food") },
    { emoji: "🏆", label: "Under Average", unlocked: totalCo2 > 0 && totalCo2 < 4.5 },
  ];

  const joinDate = new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const avgPerActivity = log.length > 0 ? (totalCo2 / log.length).toFixed(2) : "0.00";

  return (
    <div style={{ padding: "24px", maxWidth: "500px", margin: "0 auto", fontFamily: "'Inter', sans-serif" }}>

      <style>{`
        .profile-btn:focus-visible { outline: 2px solid #4edea3; outline-offset: 2px; }
      `}</style>

      {/* Profile Card */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px", marginBottom: "16px", textAlign: "center" }}>

        {/* Avatar */}
        <div aria-hidden="true" style={{ width: "80px", height: "80px", background: "linear-gradient(135deg, #4edea3, #10b981)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "32px", fontWeight: 800, color: "#003824", boxShadow: "0 0 30px rgba(78,222,163,0.3)" }}>
          {name.charAt(0).toUpperCase()}
        </div>

        {editing ? (
          <div style={{ marginBottom: "8px" }}>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") handleCancelEdit(); }}
              aria-label="Edit your display name"
              style={{ background: "rgba(14,14,14,0.6)", border: "1px solid rgba(78,222,163,0.4)", borderRadius: "10px", padding: "10px 14px", color: "#e5e2e1", fontSize: "18px", fontWeight: 700, fontFamily: "'Inter',sans-serif", outline: "none", textAlign: "center", width: "100%", boxSizing: "border-box" }}
              autoFocus
            />
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              <button className="profile-btn" onClick={handleSave} style={{ flex: 1, padding: "10px", background: "#4edea3", color: "#003824", border: "none", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: "14px" }}>Save</button>
              <button className="profile-btn" onClick={handleCancelEdit} style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.05)", color: "#bbcabf", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontFamily: "'Inter',sans-serif", fontSize: "14px" }}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "4px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#e5e2e1" }}>{name}</h2>
            <button className="profile-btn" onClick={() => setEditing(true)} aria-label="Edit name" style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(187,202,191,0.4)", padding: "2px", display: "flex" }}>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          </div>
        )}

        {saved && <p role="status" aria-live="polite" style={{ color: "#4edea3", fontSize: "13px", marginBottom: "4px" }}>✓ Name updated!</p>}

        <p style={{ color: "rgba(187,202,191,0.5)", fontSize: "14px", marginBottom: "4px" }}>{user.email}</p>
        <p style={{ color: "rgba(187,202,191,0.35)", fontSize: "12px" }}>Member since {joinDate}</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        {[
          { label: "Total CO₂", value: `${totalCo2.toFixed(1)}kg`, color: totalCo2 < 4.5 ? "#4edea3" : "#ff6b6b" },
          { label: "Activities", value: log.length, color: "#54a0ff" },
          { label: "Streak", value: <>{streak} <span aria-hidden="true">🔥</span></>, color: "#ffb95f" },
        ].map((s, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "16px 12px", textAlign: "center" }}>
            <p style={{ fontSize: "20px", fontWeight: 800, color: s.color, marginBottom: "4px" }}>{s.value}</p>
            <p style={{ fontSize: "11px", color: "rgba(187,202,191,0.5)", fontWeight: 600, letterSpacing: "0.04em" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Avg per activity */}
      <div style={{ background: "rgba(78,222,163,0.04)", border: "1px solid rgba(78,222,163,0.1)", borderRadius: "14px", padding: "16px 20px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "rgba(187,202,191,0.5)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>Avg per Activity</p>
          <p style={{ fontSize: "22px", fontWeight: 800, color: "#4edea3" }}>{avgPerActivity} <span style={{ fontSize: "14px", fontWeight: 600 }}>kg CO₂</span></p>
        </div>
        <span aria-hidden="true" style={{ fontSize: "32px" }}>{parseFloat(avgPerActivity) < 2 ? "😊" : parseFloat(avgPerActivity) < 5 ? "😐" : "😟"}</span>
      </div>

      {/* Badges */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "rgba(187,202,191,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>Badges</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
          {badges.map((b, i) => (
            <div
              key={i}
              role="img"
              aria-label={`${b.label} badge, ${b.unlocked ? "unlocked" : "locked"}`}
              style={{ background: b.unlocked ? "rgba(78,222,163,0.07)" : "rgba(255,255,255,0.02)", border: `1px solid ${b.unlocked ? "rgba(78,222,163,0.2)" : "rgba(255,255,255,0.04)"}`, borderRadius: "12px", padding: "14px 8px", textAlign: "center", opacity: b.unlocked ? 1 : 0.35, transition: "all 0.2s" }}
            >
              <div aria-hidden="true" style={{ fontSize: "26px", marginBottom: "6px", filter: b.unlocked ? "none" : "grayscale(1)" }}>{b.emoji}</div>
              <p aria-hidden="true" style={{ fontSize: "11px", fontWeight: 600, color: b.unlocked ? "#4edea3" : "rgba(187,202,191,0.5)", lineHeight: 1.3 }}>{b.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        className="profile-btn"
        onClick={handleLogout}
        style={{ width: "100%", padding: "14px", background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", color: "#ff6b6b", fontSize: "15px", fontWeight: 700, borderRadius: "12px", cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,107,0.15)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,107,107,0.08)"}
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Sign Out
      </button>
    </div>
  );
}

Profile.propTypes = {
  log: PropTypes.arrayOf(
    PropTypes.shape({
      activity: PropTypes.string,
      co2_kg: PropTypes.number,
      category: PropTypes.string,
    })
  ).isRequired,
  totalCo2: PropTypes.number.isRequired,
  streak: PropTypes.number.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default Profile;