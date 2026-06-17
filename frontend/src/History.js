import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const categoryIcons = { food: "restaurant", travel: "directions_car", energy: "bolt" };
const categoryColors = { food: "#ff9f43", travel: "#54a0ff", energy: "#ffd32a" };

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background:'rgba(14,14,14,0.95)', border:'1px solid rgba(78,222,163,0.3)', borderRadius:'10px', padding:'12px 16px' }}>
        <p style={{ color:'#bbcabf', fontSize:'12px', marginBottom:'4px' }}>{label}</p>
        <p style={{ color:'#4edea3', fontSize:'16px', fontWeight:700 }}>{payload[0].value} kg CO₂</p>
      </div>
    );
  }
  return null;
};

function History({ log, totalCo2 }) {
  const [filter, setFilter] = useState("all");
  const avgFootprint = 4.5;

  // Build real weekly data from log using logged_at timestamps
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const today = new Date();
  const weekData = days.map((day, i) => {
    const date = new Date(today);
    const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
    date.setDate(today.getDate() - (todayIndex - i));
    const dateStr = date.toDateString();
    const co2 = log
      .filter(e => {
        const entryDate = e.logged_at ? new Date(e.logged_at).toDateString() : new Date().toDateString();
        return entryDate === dateStr;
      })
      .reduce((sum, e) => sum + e.co2_kg, 0);
    return { day, co2: parseFloat(co2.toFixed(1)), avg: avgFootprint };
  });

  const categoryTotals = log.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.co2_kg;
    return acc;
  }, {});

  const getImpactLabel = (kg) => {
    if (kg < 2) return { label: 'Low Impact', color: '#4edea3', bg: 'rgba(78,222,163,0.1)', border: 'rgba(78,222,163,0.2)' };
    if (kg < 10) return { label: 'Medium Impact', color: '#bbcabf', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' };
    return { label: 'High Impact', color: '#ffb4ab', bg: 'rgba(147,0,10,0.2)', border: 'rgba(255,180,171,0.2)' };
  };

  // Group entries by real date
  const todayStr = new Date().toDateString();
  const yesterdayStr = new Date(Date.now() - 86400000).toDateString();

  const getGroup = (entry) => {
    const entryDate = entry.logged_at ? new Date(entry.logged_at).toDateString() : todayStr;
    if (entryDate === todayStr) return 'Today';
    if (entryDate === yesterdayStr) return 'Yesterday';
    return 'Last Week';
  };

  const filteredLog = filter === 'all' ? log : log.filter(e => e.category === filter);

  const weeklyAvg = log.length > 0
    ? (weekData.reduce((a, b) => a + b.co2, 0) / 7).toFixed(1)
    : "0.0";
  const monthlyCo2 = (parseFloat(weeklyAvg) * 30).toFixed(1);

  return (
    <>
      <style>{`
        .glass-h { background: rgba(255,255,255,0.03); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.1); }
        .glass-h:hover { background: rgba(255,255,255,0.05); border-color: rgba(78,222,163,0.2); }
        .bar-glow { filter: drop-shadow(0 0 8px rgba(78,222,163,0.4)); }
        .log-row { transition: all 0.2s; }
        .log-row:hover { background: rgba(255,255,255,0.04); border-color: rgba(78,222,163,0.2) !important; }
        .filter-btn { transition: all 0.2s; cursor: pointer; border: none; font-family: 'Inter', sans-serif; }
      `}</style>

      <div style={{ padding:'24px 20px', maxWidth:'800px', margin:'0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom:'28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
            <span className="material-symbols-outlined" style={{ color:'#4edea3', fontSize:'22px' }}>history</span>
            <h1 style={{ fontSize:'28px', fontWeight:800, color:'#e5e2e1', letterSpacing:'-0.02em' }}>History</h1>
          </div>
          <p style={{ color:'#bbcabf', fontSize:'15px' }}>Your carbon footprint over time</p>
        </div>

        {/* Monthly Summary Card */}
        <div className="glass-h" style={{ borderRadius:'16px', padding:'24px', marginBottom:'20px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:'-40px', right:'-40px', width:'200px', height:'200px', background:'rgba(78,222,163,0.06)', filter:'blur(60px)', borderRadius:'50%' }} />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
            <div>
              <h2 style={{ fontSize:'18px', fontWeight:700, color:'#e5e2e1', marginBottom:'4px' }}>Weekly Overview</h2>
              <p style={{ color:'rgba(187,202,191,0.7)', fontSize:'14px' }}>Your carbon impact this week</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:'32px', fontWeight:800, color:'#4edea3', letterSpacing:'-0.02em', lineHeight:1 }}>{totalCo2.toFixed(1)} <span style={{ fontSize:'14px', fontWeight:400, color:'#bbcabf' }}>kg CO₂</span></div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'4px', marginTop:'6px', background: totalCo2 < avgFootprint ? 'rgba(16,185,129,0.15)' : 'rgba(255,107,107,0.15)', color: totalCo2 < avgFootprint ? '#10b981' : '#ff6b6b', border:`1px solid ${totalCo2 < avgFootprint ? 'rgba(16,185,129,0.2)' : 'rgba(255,107,107,0.2)'}`, borderRadius:'6px', padding:'2px 8px', fontSize:'12px', fontWeight:600 }}>
                <span className="material-symbols-outlined" style={{ fontSize:'14px' }}>{totalCo2 < avgFootprint ? 'trending_down' : 'trending_up'}</span>
                {totalCo2 < avgFootprint ? 'Under average' : 'Over average'}
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weekData} margin={{ top:0, right:0, left:-30, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill:'rgba(187,202,191,0.6)', fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'rgba(187,202,191,0.6)', fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="co2" fill="#4edea3" radius={[4,4,0,0]} opacity={0.85} className="bar-glow" />
              <Bar dataKey="avg" fill="rgba(255,255,255,0.06)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:'8px' }}>
            <span style={{ fontSize:'10px', color:'rgba(187,202,191,0.4)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Mon</span>
            <span style={{ fontSize:'10px', color:'rgba(187,202,191,0.4)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Sun</span>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px,1fr))', gap:'12px', marginBottom:'20px' }}>
          {[
            { label:'TODAY', value:`${totalCo2.toFixed(1)} kg`, icon:'today', color:'#4edea3' },
            { label:'WEEKLY AVG', value:`${weeklyAvg} kg`, icon:'calendar_view_week', color:'#54a0ff' },
            { label:'VS AVERAGE', value: totalCo2 < avgFootprint ? `${(avgFootprint-totalCo2).toFixed(1)} kg ✅` : `+${(totalCo2-avgFootprint).toFixed(1)} kg ⚠️`, icon:'compare_arrows', color: totalCo2 < avgFootprint ? '#4edea3' : '#ff6b6b' },
            { label:'ACTIVITIES', value:log.length, icon:'list_alt', color:'#ffb95f' },
          ].map((s, i) => (
            <div key={i} className="glass-h" style={{ borderRadius:'12px', padding:'16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'10px' }}>
                <span className="material-symbols-outlined" style={{ color:s.color, fontSize:'16px' }}>{s.icon}</span>
                <span style={{ fontSize:'10px', color:'#bbcabf', fontWeight:600, letterSpacing:'0.07em' }}>{s.label}</span>
              </div>
              <p style={{ fontSize:'20px', fontWeight:800, color:s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        {Object.keys(categoryTotals).length > 0 && (
          <div className="glass-h" style={{ borderRadius:'16px', padding:'20px', marginBottom:'20px' }}>
            <h3 style={{ fontSize:'15px', fontWeight:700, color:'#e5e2e1', marginBottom:'16px', display:'flex', alignItems:'center', gap:'6px' }}>
              <span className="material-symbols-outlined" style={{ color:'#ffb95f', fontSize:'18px' }}>donut_small</span>
              Category Breakdown
            </h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {Object.entries(categoryTotals).map(([cat, val]) => {
                const pct = Math.min((val / (totalCo2 || 1)) * 100, 100);
                return (
                  <div key={cat}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                        <span className="material-symbols-outlined" style={{ color: categoryColors[cat] || '#4edea3', fontSize:'16px' }}>{categoryIcons[cat] || 'eco'}</span>
                        <span style={{ fontSize:'13px', color:'#e5e2e1', textTransform:'capitalize' }}>{cat}</span>
                      </div>
                      <span style={{ fontSize:'13px', fontWeight:700, color: categoryColors[cat] || '#4edea3' }}>{val.toFixed(2)} kg</span>
                    </div>
                    <div style={{ height:'6px', background:'rgba(255,255,255,0.06)', borderRadius:'999px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${pct}%`, background: categoryColors[cat] || '#4edea3', borderRadius:'999px', transition:'width 0.8s cubic-bezier(0.16,1,0.3,1)', boxShadow:`0 0 8px ${categoryColors[cat] || '#4edea3'}60` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter Pills */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'16px', overflowX:'auto', paddingBottom:'4px' }}>
          {[['all','All'],['food','Food'],['travel','Travel'],['energy','Energy']].map(([val, label]) => (
            <button key={val} className="filter-btn" onClick={() => setFilter(val)}
              style={{ flexShrink:0, padding:'8px 20px', borderRadius:'999px', fontSize:'12px', fontWeight:600, letterSpacing:'0.05em',
                background: filter===val ? '#4edea3' : 'rgba(255,255,255,0.04)',
                color: filter===val ? '#003824' : '#bbcabf',
                border: filter===val ? 'none' : '1px solid rgba(255,255,255,0.1)',
                boxShadow: filter===val ? '0 0 16px rgba(78,222,163,0.3)' : 'none' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Activity Log grouped by real date */}
        {filteredLog.length === 0 ? (
          <div className="glass-h" style={{ borderRadius:'16px', padding:'48px', textAlign:'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize:'48px', color:'rgba(187,202,191,0.2)', display:'block', marginBottom:'12px' }}>inbox</span>
            <p style={{ color:'#bbcabf', fontSize:'15px' }}>No activities logged yet.</p>
          </div>
        ) : (
          ['Today','Yesterday','Last Week'].map(group => {
            const entries = filteredLog.filter(e => getGroup(e) === group);
            if (entries.length === 0) return null;
            return (
              <div key={group} style={{ marginBottom:'24px' }}>
                <h3 style={{ fontSize:'12px', fontWeight:600, color: group==='Today' ? '#4edea3' : 'rgba(187,202,191,0.6)', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'12px', paddingLeft:'4px' }}>{group}</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  {entries.map((entry, i) => {
                    const impact = getImpactLabel(entry.co2_kg);
                    return (
                      <div key={i} className="glass-h log-row" style={{ borderRadius:'14px', padding:'16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                          <div style={{ width:'48px', height:'48px', borderRadius:'12px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <span className="material-symbols-outlined" style={{ color: categoryColors[entry.category] || '#4edea3', fontSize:'22px' }}>{categoryIcons[entry.category] || 'eco'}</span>
                          </div>
                          <div>
                            <p style={{ fontSize:'15px', fontWeight:600, color:'#e5e2e1', marginBottom:'3px' }}>{entry.activity}</p>
                            <p style={{ fontSize:'12px', color:'rgba(187,202,191,0.6)' }}>{entry.time} • {entry.category}</p>
                          </div>
                        </div>
                        <div style={{ textAlign:'right', flexShrink:0 }}>
                          <p style={{ fontSize:'15px', fontWeight:700, color: entry.co2_kg < 2 ? '#4edea3' : entry.co2_kg < 10 ? '#e5e2e1' : '#ffb4ab', marginBottom:'4px' }}>
                            {entry.co2_kg} kg
                          </p>
                          <span style={{ fontSize:'10px', padding:'2px 8px', borderRadius:'6px', fontWeight:600, letterSpacing:'0.05em', textTransform:'uppercase', color: impact.color, background: impact.bg, border:`1px solid ${impact.border}` }}>
                            {impact.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export default History;