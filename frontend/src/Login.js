import React, { useState } from "react";

function Login({
  onLogin,
  onGuestLogin,
  onGoSignup,
  onForgotPassword,
  onGoHome
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
  setError("");
  if (!email || !password) { setError("Please fill in all fields."); return; }
  try {
    const res = await fetch("https://carbon-nudge.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    localStorage.setItem("cn_current_user", JSON.stringify(data));
    onLogin(data);
  } catch {
    setError("Could not connect to server.");
  }
};

  return (
    <div style={{ minHeight:"100vh", background:"#0A0A0A", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", fontFamily:"'Inter',sans-serif", position:"relative", overflow:"hidden" }}>
      
      <div style={{ position:"fixed", top:"-10%", right:"-5%", width:"40vw", height:"40vw", background:"rgba(78,222,163,0.07)", filter:"blur(120px)", borderRadius:"50%", pointerEvents:"none" }} />
      <div style={{ position:"fixed", bottom:"-10%", left:"-5%", width:"30vw", height:"30vw", background:"rgba(5,102,217,0.06)", filter:"blur(100px)", borderRadius:"50%", pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:"400px", position:"relative", zIndex:1 }}>

        <button onClick={onGoHome} style={{ display:"flex", alignItems:"center", gap:"6px", background:"none", border:"none", color:"rgba(187,202,191,0.6)", cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:"13px", fontWeight:600, marginBottom:"24px", padding:0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Home
        </button>

        <div style={{ textAlign:"center", marginBottom:"40px" }}>
          <div style={{ width:"72px", height:"72px", background:"rgba(78,222,163,0.1)", border:"1px solid rgba(78,222,163,0.25)", borderRadius:"20px", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", boxShadow:"0 0 30px rgba(78,222,163,0.2)" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="#4edea3">
              <path d="M17 8C8 10 5.9 16.17 3.82 19.34C2.92 20.74 1 20.22 1 18.62V5.5C1 4.12 2.12 3 3.5 3H20.5C21.88 3 23 4.12 23 5.5V9C23 9 21 8 17 8ZM1 22H23" stroke="#4edea3" strokeWidth="1.5" fill="none"/>
              <path d="M12 18C12 15.79 13.79 14 16 14C18.21 14 20 15.79 20 18C20 20.21 18.21 22 16 22C13.79 22 12 20.21 12 18Z" fill="#4edea3"/>
            </svg>
          </div>
          <h1 style={{ fontSize:"36px", fontWeight:800, color:"#4edea3", letterSpacing:"-0.02em", marginBottom:"8px" }}>Carbon Nudge</h1>
          <p style={{ color:"rgba(187,202,191,0.7)", fontSize:"16px" }}>Sign in to your sustainable journey</p>
        </div>

        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"24px", padding:"32px", backdropFilter:"blur(20px)" }}>

          {error && (
            <div style={{ background:"rgba(255,107,107,0.1)", border:"1px solid rgba(255,107,107,0.3)", borderRadius:"10px", padding:"12px 16px", marginBottom:"20px", color:"#ff6b6b", fontSize:"14px" }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom:"18px" }}>
            <label style={{ display:"block", fontSize:"11px", fontWeight:700, color:"rgba(187,202,191,0.6)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"8px" }}>Email Address</label>
            <input
              type="email"
              aria-label="Email address"
              placeholder="name@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ width:"100%", background:"rgba(14,14,14,0.6)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", padding:"14px 16px", color:"#e5e2e1", fontSize:"15px", fontFamily:"'Inter',sans-serif", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "rgba(78,222,163,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
            />
          </div>

          <div style={{ marginBottom:"24px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
              <label style={{ fontSize:"11px", fontWeight:700, color:"rgba(187,202,191,0.6)", letterSpacing:"0.08em", textTransform:"uppercase" }}>Password</label>
              <button onClick={onForgotPassword} style={{ fontSize:"13px", fontWeight:600, color:"#4edea3", background:"none", border:"none", cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>Forgot password?</button>
            </div>
            <div style={{ position:"relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                aria-label="Password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{ width:"100%", background:"rgba(14,14,14,0.6)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", padding:"14px 48px 14px 16px", color:"#e5e2e1", fontSize:"15px", fontFamily:"'Inter',sans-serif", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "rgba(78,222,163,0.5)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
              />
              <button onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} style={{ position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(187,202,191,0.5)", padding:0, display:"flex" }}>
                {showPassword
                  ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            style={{ width:"100%", padding:"15px", background:"#4edea3", color:"#003824", fontSize:"16px", fontWeight:700, border:"none", borderRadius:"12px", cursor:"pointer", fontFamily:"'Inter',sans-serif", boxShadow:"0 0 24px rgba(78,222,163,0.3)", transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.boxShadow="0 4px 30px rgba(78,222,163,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 0 24px rgba(78,222,163,0.3)"; }}
          >
            Sign In
          </button>
          <button
  onClick={() =>
    onGuestLogin({
      name: "Demo User",
      email: "guest@carbonnudge.demo",
      joinedAt: new Date().toISOString()
    })
  }
  style={{
    width:"100%",
    padding:"15px",
    background:"transparent",
    color:"#4edea3",
    fontSize:"16px",
    fontWeight:700,
    border:"1px solid rgba(78,222,163,0.3)",
    borderRadius:"12px",
    cursor:"pointer",
    marginTop:"12px",
    fontFamily:"'Inter',sans-serif"
  }}
>
  🚀 Try Demo Mode
</button>
        </div>

        <p style={{ textAlign:"center", color:"rgba(187,202,191,0.6)", fontSize:"15px", marginTop:"24px" }}>
          New here?{" "}
          <button onClick={onGoSignup} style={{ color:"#4edea3", fontWeight:700, background:"none", border:"none", cursor:"pointer", fontSize:"15px", fontFamily:"'Inter',sans-serif" }}>Create an account</button>
        </p>
      </div>
    </div>
  );
}

export default Login;