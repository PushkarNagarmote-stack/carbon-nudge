import React, { useState } from "react";

function ForgotPassword({ onBack }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFindAccount = async () => {
    setError("");
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email."); return; }
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/find-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      setStep(2);
    } catch {
      setError("Could not connect to server.");
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setError("");
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords don't match."); return; }
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, new_password: newPassword })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      setStep(3);
    } catch {
      setError("Could not connect to server.");
    }
    setLoading(false);
  };

  return (
    <div style={{ width:'100%', maxWidth:'400px', position:'relative', zIndex:1 }}>

      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:'6px', background:'none', border:'none', color:'rgba(187,202,191,0.6)', cursor:'pointer', fontFamily:'Inter, sans-serif', fontSize:'13px', fontWeight:600, marginBottom:'32px', padding:0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Login
      </button>

      <div style={{ textAlign:'center', marginBottom:'36px' }}>
        <div style={{ width:'72px', height:'72px', background:'rgba(78,222,163,0.1)', border:'1px solid rgba(78,222,163,0.25)', borderRadius:'20px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:'0 0 30px rgba(78,222,163,0.2)' }}>
          {step === 3
            ? <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4edea3" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4edea3" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          }
        </div>
        <h1 style={{ fontSize:'28px', fontWeight:800, color:'#4edea3', letterSpacing:'-0.02em', marginBottom:'8px' }}>
          {step === 1 ? "Forgot Password?" : step === 2 ? "Set New Password" : "Password Reset!"}
        </h1>
        <p style={{ color:'rgba(187,202,191,0.7)', fontSize:'15px' }}>
          {step === 1 ? "Enter your email to find your account." : step === 2 ? `Setting new password for ${email}` : "Your password has been updated successfully."}
        </p>
      </div>

      {step === 3 ? (
        <div style={{ background:'rgba(78,222,163,0.06)', border:'1px solid rgba(78,222,163,0.2)', borderRadius:'24px', padding:'32px', textAlign:'center' }}>
          <div style={{ fontSize:'48px', marginBottom:'16px' }}>🎉</div>
          <p style={{ color:'rgba(187,202,191,0.8)', fontSize:'15px', lineHeight:1.7, marginBottom:'24px' }}>You can now sign in with your new password.</p>
          <button
            onClick={onBack}
            style={{ width:'100%', padding:'15px', background:'#4edea3', color:'#003824', fontSize:'16px', fontWeight:700, border:'none', borderRadius:'12px', cursor:'pointer', fontFamily:'Inter, sans-serif', boxShadow:'0 0 24px rgba(78,222,163,0.3)' }}
          >
            Go to Sign In
          </button>
        </div>
      ) : (
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'24px', padding:'32px', backdropFilter:'blur(20px)' }}>

          {error && (
            <div style={{ background:'rgba(255,107,107,0.1)', border:'1px solid rgba(255,107,107,0.3)', borderRadius:'10px', padding:'12px 16px', marginBottom:'20px', color:'#ff6b6b', fontSize:'14px' }}>
              {error}
            </div>
          )}

          {step === 1 && (
            <>
              <div style={{ marginBottom:'24px' }}>
                <label style={{ display:'block', fontSize:'11px', fontWeight:700, color:'rgba(187,202,191,0.6)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'8px' }}>Email Address</label>
                <input
                  type="email"
                  aria-label="Email address"
                  placeholder="name@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleFindAccount()}
                  style={{ width:'100%', background:'rgba(14,14,14,0.6)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'14px 16px', color:'#e5e2e1', fontSize:'15px', fontFamily:'Inter, sans-serif', outline:'none', boxSizing:'border-box' }}
                  onFocus={e => e.target.style.borderColor = "rgba(78,222,163,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>
              <button
                onClick={handleFindAccount}
                disabled={loading}
                style={{ width:'100%', padding:'15px', background:'#4edea3', color:'#003824', fontSize:'16px', fontWeight:700, border:'none', borderRadius:'12px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'Inter, sans-serif', boxShadow:'0 0 24px rgba(78,222,163,0.3)', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Checking..." : "Find My Account"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ marginBottom:'18px' }}>
                <label style={{ display:'block', fontSize:'11px', fontWeight:700, color:'rgba(187,202,191,0.6)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'8px' }}>New Password</label>
                <div style={{ position:'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    aria-label="New password"
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    style={{ width:'100%', background:'rgba(14,14,14,0.6)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'14px 48px 14px 16px', color:'#e5e2e1', fontSize:'15px', fontFamily:'Inter, sans-serif', outline:'none', boxSizing:'border-box' }}
                    onFocus={e => e.target.style.borderColor = "rgba(78,222,163,0.5)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                  <button onClick={() => setShowPassword(!showPassword)} style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(187,202,191,0.5)', padding:0, display:'flex' }}>
                    {showPassword
                      ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>
              <div style={{ marginBottom:'24px' }}>
                <label style={{ display:'block', fontSize:'11px', fontWeight:700, color:'rgba(187,202,191,0.6)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'8px' }}>Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  aria-label="Confirm password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleResetPassword()}
                  style={{ width:'100%', background:'rgba(14,14,14,0.6)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'14px 16px', color:'#e5e2e1', fontSize:'15px', fontFamily:'Inter, sans-serif', outline:'none', boxSizing:'border-box' }}
                  onFocus={e => e.target.style.borderColor = "rgba(78,222,163,0.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>
              <button
                onClick={handleResetPassword}
                disabled={loading}
                style={{ width:'100%', padding:'15px', background:'#4edea3', color:'#003824', fontSize:'16px', fontWeight:700, border:'none', borderRadius:'12px', cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'Inter, sans-serif', boxShadow:'0 0 24px rgba(78,222,163,0.3)', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;