import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Login from "./Login";
import Signup from "./Signup";
import History from "./History";
import Tips from "./Tips";
import Profile from "./Profile";
import ForgotPassword from "./ForgotPassword";

function App() {
  const [page, setPage] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [category, setCategory] = useState("food");
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState([]);
  const [totalCo2, setTotalCo2] = useState(0);
  const [streak, setStreak] = useState(0);
  const [animatedCo2, setAnimatedCo2] = useState(0);
  const canvasRef = useRef(null);

  const items = {
    food: ["beef", "chicken", "rice", "vegetables", "cheese", "eggs", "milk"],
    travel: ["car", "bike", "bus", "train", "flight"],
    energy: ["electricity", "lpg"],
  };
  const categoryIcons = { food: "restaurant", travel: "directions_car", energy: "bolt" };
  const categoryColors = { food: "#ff9f43", travel: "#54a0ff", energy: "#ffd32a" };

  useEffect(() => {
    if (page !== "dashboard") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const vs = `attribute vec2 a_position; varying vec2 v_uv;
    void main() { v_uv = a_position * 0.5 + 0.5; gl_Position = vec4(a_position, 0.0, 1.0); }`;
    const fs = `precision highp float;
    uniform float u_time; uniform vec2 u_resolution; varying vec2 v_uv;
    void main() {
      vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
      float r = length(uv);
      if (r > 0.75) { gl_FragColor = vec4(0.0); return; }
      float z = sqrt(0.75*0.75 - r*r);
      vec3 normal = normalize(vec3(uv, z));
      float angle = u_time * 0.3;
      mat3 rot = mat3(cos(angle),0,sin(angle), 0,1,0, -sin(angle),0,cos(angle));
      vec3 rn = rot * normal;
      float land = step(0.35, sin(rn.x*8.0)*sin(rn.y*8.0)*sin(rn.z*8.0)+0.5);
      vec3 water = vec3(0.01, 0.08, 0.25);
      vec3 earth = vec3(0.05, 0.65, 0.45);
      vec3 col = mix(water, earth, land);
      float diff = max(dot(normal, normalize(vec3(1,1,2))), 0.0);
      col *= diff + 0.25;
      float atm = pow(1.0 - normal.z, 2.5);
      col += atm * vec3(0.1, 0.4, 0.9) * 0.6;
      float edge = smoothstep(0.72, 0.75, r);
      col = mix(col, vec3(0.2,0.6,1.0)*0.3, edge);
      gl_FragColor = vec4(col, 1.0 - edge);
    }`;
    function makeShader(type, src) {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, makeShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, makeShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    let raf;
    function render(t) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, t * 0.001);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    }
    render(0);
    return () => cancelAnimationFrame(raf);
  }, [page]);

  useEffect(() => {
    if (!result) return;
    const end = result.co2_kg;
    const duration = 800;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedCo2(parseFloat((end * eased).toFixed(2)));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [result]);

  useEffect(() => {
    if (page !== "dashboard") return;
    const user = JSON.parse(localStorage.getItem("cn_current_user") || "{}");
    if (!user.email) return;
    axios.get(`https://carbon-nudge.onrender.com/api/log?user_email=${user.email}`)
      .then(res => {
        const activities = res.data.activities.map(a => ({
          ...a,
          time: new Date(a.logged_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
        }));
        setLog(activities);
        const total = activities.reduce((sum, a) => sum + a.co2_kg, 0);
        setTotalCo2(parseFloat(total.toFixed(3)));
      })
      .catch(() => {});
  }, [page, currentUser]);

  const handleCalculate = async () => {
    if (!item) { alert("Please select an item!"); return; }
    setLoading(true); setResult(null);
    try {
      const user = JSON.parse(localStorage.getItem("cn_current_user") || "{}");
      const res = await axios.post("https://carbon-nudge.onrender.com/api/calculate", {
        category, item, quantity: parseFloat(quantity), user_email: user.email || "guest"
      });
      setResult(res.data);
      setLog((prev) => [{ ...res.data, category, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }, ...prev]);
      setTotalCo2((prev) => parseFloat((prev + res.data.co2_kg).toFixed(3)));
      if (res.data.co2_kg < 2) setStreak(s => s + 1);
    } catch (err) { alert("Error connecting to backend!"); }
    setLoading(false);
  };

  const handleClearLog = async () => {
    const user = JSON.parse(localStorage.getItem("cn_current_user") || "{}");
    try {
      await axios.post("https://carbon-nudge.onrender.com/api/reset", { user_email: user.email || "guest" });
      setLog([]);
      setTotalCo2(0);
      setStreak(0);
      setResult(null);
    } catch (err) {
      alert("Error clearing log on server!");
    }
  };

  const avgFootprint = 4.5;
  const progressPercent = Math.min((totalCo2 / avgFootprint) * 100, 100);
  const isUnderAvg = totalCo2 < avgFootprint;

  const formatNudge = (text) => {
    if (!text) return null;
    return text.split('\n').filter(l => l.trim()).map((line, i) => (
      <p key={i} style={{ marginBottom:'10px', lineHeight:1.7, color: line.match(/^[123]\./) ? '#e5e2e1' : '#bbcabf' }}>{line}</p>
    ));
  };

  // AUTH PAGES
  if (page === "login") return <Login onLogin={(user) => { setCurrentUser(user); setPage("dashboard"); }} onGoSignup={() => setPage("signup")} onForgotPassword={() => setPage("forgot")} />;
  if (page === "signup") return <Signup onSignup={(user) => { setPage("login"); }} onGoLogin={() => setPage("login")} />;
  if (page === "forgot") return (
  <div style={{ minHeight:'100vh', background:'#0A0A0A', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px', fontFamily:'Inter, sans-serif', position:'relative', overflow:'hidden' }}>

    <div style={{ position:'fixed', top:'-10%', right:'-5%', width:'40vw', height:'40vw', background:'rgba(78,222,163,0.07)', filter:'blur(120px)', borderRadius:'50%', pointerEvents:'none' }} />
    <div style={{ position:'fixed', bottom:'-10%', left:'-5%', width:'30vw', height:'30vw', background:'rgba(5,102,217,0.06)', filter:'blur(100px)', borderRadius:'50%', pointerEvents:'none' }} />

    <ForgotPassword onBack={() => setPage("login")} />
  </div>
);
  // MAIN APP
  const navItems = [['dashboard','Dashboard','dashboard'],['history','History','history'],['tips','Tips','lightbulb'],['profile','Profile','person']];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#0e0e0e; color:#e5e2e1; font-family:'Inter',sans-serif; min-height:100vh; overflow-x:hidden; }
        .material-symbols-outlined { font-family:'Material Symbols Outlined'; font-style:normal; font-weight:normal; font-size:24px; display:inline-block; }
        .glass { background:rgba(255,255,255,0.04); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:24px; }
        .cat-btn { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:14px 8px; border-radius:12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); color:#bbcabf; cursor:pointer; transition:all 0.3s; flex:1; font-family:'Inter',sans-serif; }
        .cat-btn:hover { background:rgba(255,255,255,0.07); }
        .input-glass { background:rgba(14,14,14,0.8); border:1px solid rgba(255,255,255,0.1); border-bottom:2px solid rgba(255,255,255,0.15); color:#e5e2e1; font-family:'Inter',sans-serif; font-size:15px; padding:12px 14px; width:100%; border-radius:10px; transition:all 0.3s; appearance:none; }
        .input-glass:focus { outline:none; border-bottom:2px solid #4edea3; background:rgba(14,14,14,0.95); }
        .input-glass option { background:#1a1a1a; }
        .calc-btn { width:100%; padding:16px; background:linear-gradient(135deg,#4edea3,#10b981); color:#003824; font-size:17px; font-weight:800; border:none; border-radius:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.3s; margin-top:12px; font-family:'Inter',sans-serif; }
        .calc-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 12px 30px rgba(78,222,163,0.35); }
        .calc-btn:disabled { opacity:0.5; cursor:not-allowed; }
        *:focus-visible { outline: 2px solid #4edea3; outline-offset: 3px; }
        .result-fade { animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1); }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .log-item { display:flex; align-items:center; justify-content:space-between; padding:12px; border-radius:10px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.05); margin-bottom:8px; transition:all 0.2s; }
        .log-item:hover { background:rgba(255,255,255,0.06); }
        .progress-bar { width:100%; height:10px; background:rgba(255,255,255,0.08); border-radius:999px; overflow:hidden; margin-top:10px; }
        .progress-fill { height:100%; border-radius:999px; transition:width 0.8s cubic-bezier(0.16,1,0.3,1); }
        .badge { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:999px; font-size:12px; font-weight:600; }
        .pulse { animation:pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:transparent; } ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:999px; }
      `}</style>

      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />

      <header style={{ position:'fixed', top:0, width:'100%', zIndex:50, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', height:'60px', background:'rgba(14,14,14,0.85)', backdropFilter:'blur(24px)', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <span className="material-symbols-outlined" style={{ color:'#4edea3', fontSize:'22px' }}>eco</span>
        <span style={{ fontSize:'20px', fontWeight:800, color:'#4edea3', letterSpacing:'-0.02em' }}>Carbon Nudge</span>
        {streak > 0
          ? <div className="badge" style={{ background:'rgba(255,185,95,0.15)', color:'#ffb95f', border:'1px solid rgba(255,185,95,0.3)' }}><span className="material-symbols-outlined" style={{ fontSize:'14px' }}>local_fire_department</span>{streak} streak</div>
          : <div style={{ width:'60px' }} />}
      </header>

      <main style={{ paddingTop:'60px', paddingBottom:'80px' }}>

        {page === "history" && <History log={log} totalCo2={totalCo2} />}

        {page === "tips" && <Tips log={log} totalCo2={totalCo2} />}

        {page === "profile" && <Profile log={log} totalCo2={totalCo2} streak={streak} onLogout={() => { setLog([]); setTotalCo2(0); setStreak(0); setCurrentUser(null); setPage("login"); }} />}

        {page === "dashboard" && (
          <>
            <section style={{ position:'relative', width:'100%', height:'420px', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
              <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.85, mixBlendMode:'screen' }} />
              <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, rgba(78,222,163,0.08) 0%, transparent 65%)' }} />
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'180px', background:'linear-gradient(to bottom, transparent, #0e0e0e)' }} />
              <div style={{ position:'relative', zIndex:2, textAlign:'center', padding:'0 24px' }}>
                <div className="badge pulse" style={{ background:'rgba(78,222,163,0.1)', color:'#4edea3', border:'1px solid rgba(78,222,163,0.25)', margin:'0 auto 16px', width:'fit-content' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'14px' }}>sensors</span>
                  AI-Powered Tracking
                </div>
                <h1 style={{ fontSize:'clamp(32px,6vw,58px)', fontWeight:800, color:'#fff', letterSpacing:'-0.03em', lineHeight:1.05, marginBottom:'16px', textShadow:'0 0 60px rgba(78,222,163,0.3)' }}>
                  Track Your Carbon.<br /><span style={{ color:'#4edea3' }}>Change Your World.</span>
                </h1>
                <p style={{ fontSize:'17px', color:'#bbcabf', maxWidth:'520px', margin:'0 auto', lineHeight:1.6 }}>Real-time insights and AI-powered nudges for a sustainable lifestyle.</p>
              </div>
            </section>

            <div style={{ padding:'32px 24px 0', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'20px', maxWidth:'1100px', margin:'0 auto' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                <div className="glass">
                  <h2 style={{ fontSize:'20px', fontWeight:700, marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px', color:'#e5e2e1' }}>
                    <span className="material-symbols-outlined" style={{ color:'#4edea3', fontSize:'22px' }}>add_circle</span>Log Activity
                  </h2>
                  <div style={{ display:'flex', gap:'10px', marginBottom:'20px' }}>
                    {["food","travel","energy"].map((c) => (
                      <button key={c} className="cat-btn"
                        style={{ color: category===c ? categoryColors[c] : '#bbcabf', background: category===c ? `${categoryColors[c]}15` : 'rgba(255,255,255,0.03)', borderColor: category===c ? `${categoryColors[c]}40` : 'rgba(255,255,255,0.08)', boxShadow: category===c ? `0 0 16px ${categoryColors[c]}20` : 'none' }}
                        onClick={() => { setCategory(c); setItem(""); }}>
                        <span className="material-symbols-outlined" style={{ fontSize:'28px', marginBottom:'6px', fontVariationSettings: category===c ? "'FILL' 1" : "'FILL' 0" }}>{categoryIcons[c]}</span>
                        <span style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase' }}>{c}</span>
                      </button>
                    ))}
                  </div>
                  <div style={{ marginBottom:'14px' }}>
                    <label style={{ display:'block', fontSize:'11px', fontWeight:700, color:'#bbcabf', marginBottom:'6px', letterSpacing:'0.07em', textTransform:'uppercase' }}>Item</label>
                    <select className="input-glass" value={item} onChange={(e) => setItem(e.target.value)}>
                      <option value="">Select item...</option>
                      {items[category].map((i) => <option key={i} value={i}>{i.charAt(0).toUpperCase()+i.slice(1)}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom:'4px' }}>
                    <label style={{ display:'block', fontSize:'11px', fontWeight:700, color:'#bbcabf', marginBottom:'6px', letterSpacing:'0.07em', textTransform:'uppercase' }}>
                      Quantity {category==="travel" ? "(km)" : category==="energy" ? "(units)" : "(servings)"}
                    </label>
                    <input className="input-glass" type="number" min="0.1" step="0.1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                  </div>
                  <button className="calc-btn" onClick={handleCalculate} disabled={loading}>
                    {loading
                      ? <><span className="material-symbols-outlined" style={{ fontSize:'20px' }}>progress_activity</span> Analyzing...</>
                      : <><span className="material-symbols-outlined" style={{ fontSize:'20px' }}>calculate</span> Calculate My Impact</>}
                  </button>
                </div>

                <div className="glass" style={{ borderLeft: result ? '3px solid #4edea3' : '3px solid rgba(5,102,217,0.5)', minHeight:'180px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                  <p style={{ fontSize:'11px', fontWeight:700, color:'#bbcabf', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'14px' }}>Estimated Impact</p>
                  {result ? (
                    <div className="result-fade" style={{ width:'100%' }}>
                      <div style={{ textAlign:'center', marginBottom:'20px' }}>
                        <span style={{ fontSize:'52px', fontWeight:800, color:'#4edea3', textShadow:'0 0 30px rgba(78,222,163,0.5)', letterSpacing:'-0.03em' }}>{animatedCo2}</span>
                        <span style={{ fontSize:'22px', fontWeight:700, color:'#4edea3', marginLeft:'6px' }}>kg CO₂</span>
                      </div>
                      <div style={{ background:'rgba(78,222,163,0.05)', borderRadius:'10px', padding:'16px', border:'1px solid rgba(78,222,163,0.1)' }}>
                        {formatNudge(result.nudge)}
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign:'center' }}>
                      <div className="pulse" style={{ fontSize:'44px', fontWeight:800, color:'rgba(5,102,217,0.6)', letterSpacing:'-0.03em', marginBottom:'12px' }}>--- <span style={{ fontSize:'22px' }}>kg CO₂</span></div>
                      <p style={{ fontSize:'15px', color:'#bbcabf', lineHeight:1.6 }}>Select an activity above<br/>to see your AI-driven impact.</p>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                <div className="glass">
                  <h2 style={{ fontSize:'20px', fontWeight:700, marginBottom:'18px', display:'flex', alignItems:'center', gap:'8px' }}>
                    <span className="material-symbols-outlined" style={{ color:'#ffb95f', fontSize:'22px' }}>trending_down</span>Today's Overview
                  </h2>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'6px' }}>
                    <div>
                      <span style={{ fontSize:'40px', fontWeight:800, color:'#e5e2e1', letterSpacing:'-0.03em' }}>{totalCo2.toFixed(1)}</span>
                      <span style={{ fontSize:'15px', color:'#bbcabf', marginLeft:'6px' }}>kg CO₂</span>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <span style={{ fontSize:'11px', color:'#bbcabf', display:'block', letterSpacing:'0.05em' }}>DAILY AVG</span>
                      <span style={{ fontSize:'17px', color:'#e5e2e1', fontWeight:600 }}>4.5 kg</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width:`${progressPercent}%`, background: isUnderAvg ? 'linear-gradient(90deg,#4edea3,#10b981)' : 'linear-gradient(90deg,#ff6b6b,#ee5a24)', boxShadow: isUnderAvg ? '0 0 12px rgba(78,222,163,0.6)' : '0 0 12px rgba(255,107,107,0.6)' }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:'6px' }}>
                    <span style={{ fontSize:'11px', color:'#bbcabf' }}>0 kg</span>
                    <span style={{ fontSize:'11px', color: isUnderAvg ? '#4edea3' : '#ff6b6b', fontWeight:600 }}>{progressPercent.toFixed(0)}% of daily avg</span>
                    <span style={{ fontSize:'11px', color:'#bbcabf' }}>4.5 kg</span>
                  </div>
                  <div style={{ marginTop:'16px', padding:'14px', borderRadius:'10px', background: isUnderAvg ? 'rgba(78,222,163,0.07)' : 'rgba(255,107,107,0.07)', border:`1px solid ${isUnderAvg ? 'rgba(78,222,163,0.15)' : 'rgba(255,107,107,0.15)'}`, display:'flex', gap:'10px', alignItems:'flex-start' }}>
                    <span className="material-symbols-outlined" style={{ color: isUnderAvg ? '#4edea3' : '#ff6b6b', fontSize:'20px', marginTop:'1px' }}>{isUnderAvg ? 'sentiment_very_satisfied' : 'warning'}</span>
                    <p style={{ fontSize:'14px', color: isUnderAvg ? '#4edea3' : '#ff6b6b', lineHeight:1.6 }}>
                      {log.length === 0 ? "Start logging activities to see your daily impact!"
                        : isUnderAvg ? `Great job! You're ${(avgFootprint-totalCo2).toFixed(1)} kg under the daily average. 🌱`
                        : `You've exceeded today's average by ${(totalCo2-avgFootprint).toFixed(1)} kg. Try greener choices!`}
                    </p>
                  </div>
                  {log.length > 0 && (
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginTop:'16px' }}>
                      {[
                        { label:'Activities', value:log.length },
                        { label:'Avg/Activity', value:`${(totalCo2/log.length).toFixed(1)}kg` },
                        { label:'Green Streak', value:`${streak}🔥` },
                      ].map((stat, i) => (
                        <div key={i} style={{ background:'rgba(255,255,255,0.03)', borderRadius:'10px', padding:'12px', textAlign:'center', border:'1px solid rgba(255,255,255,0.06)' }}>
                          <p style={{ fontSize:'18px', fontWeight:800, color:'#4edea3' }}>{stat.value}</p>
                          <p style={{ fontSize:'11px', color:'#bbcabf', marginTop:'2px' }}>{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="glass" style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
                    <h2 style={{ fontSize:'20px', fontWeight:700 }}>Recent Logs</h2>
                    {log.length > 0 && <span className="badge" style={{ background:'rgba(78,222,163,0.1)', color:'#4edea3', border:'1px solid rgba(78,222,163,0.2)', cursor:'pointer' }} onClick={handleClearLog}>Clear</span>}
                  </div>
                  {log.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'32px 0', color:'#bbcabf' }}>
                      <span className="material-symbols-outlined" style={{ fontSize:'40px', display:'block', marginBottom:'12px', opacity:0.4 }}>inbox</span>
                      <p style={{ fontSize:'14px' }}>No activities logged yet.</p>
                    </div>
                  ) : log.slice(0,6).map((entry, i) => (
                    <div key={i} className="log-item">
                      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                        <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:`${categoryColors[entry.category]||'#4edea3'}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <span className="material-symbols-outlined" style={{ color: categoryColors[entry.category]||'#4edea3', fontSize:'18px' }}>{categoryIcons[entry.category]}</span>
                        </div>
                        <div>
                          <p style={{ fontSize:'14px', fontWeight:600, color:'#e5e2e1' }}>{entry.activity}</p>
                          <p style={{ fontSize:'11px', color:'#bbcabf', marginTop:'2px' }}>{entry.time}</p>
                        </div>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <p style={{ fontSize:'15px', fontWeight:700, color: entry.co2_kg < 2 ? '#4edea3' : entry.co2_kg < 10 ? '#ffb95f' : '#ff6b6b' }}>{entry.co2_kg} kg</p>
                        <p style={{ fontSize:'11px', color:'#bbcabf' }}>CO₂</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <nav style={{ position:'fixed', bottom:0, width:'100%', zIndex:50, display:'flex', justifyContent:'space-around', alignItems:'center', height:'68px', background:'rgba(20,20,20,0.4)', backdropFilter:'blur(24px)', borderTop:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px 16px 0 0', boxShadow:'0 -4px 20px rgba(78,222,163,0.1)' }}>
        {navItems.map(([p, label, icon]) => {
          const active = page === p;
          return (
            <button key={p} onClick={() => setPage(p)}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', color: active ? '#4edea3' : 'rgba(187,202,191,0.6)', background:'none', border:'none', fontSize:'11px', fontWeight:600, gap:'3px', cursor:'pointer', filter: active ? 'drop-shadow(0 0 6px rgba(78,222,163,0.5))' : 'none', fontFamily:'Inter, sans-serif', transition:'all 0.3s' }}>
              <span className="material-symbols-outlined" style={{ fontSize:'22px', fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </nav>
    </>
  );
}

export default App;