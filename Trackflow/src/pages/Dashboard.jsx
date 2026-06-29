import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
} from "recharts";
import { CheckSquare, Clock, CheckCircle, AlertTriangle, TrendingUp, Activity, Zap } from "lucide-react";
import useAppStore from "../store/useAppStore";

const heatColors = ["rgba(99,102,241,0.08)","rgba(99,102,241,0.25)","rgba(99,102,241,0.5)","#4f46e5","#3730a3"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const tt = {
  borderRadius:"12px", border:"1px solid var(--border)",
  background:"var(--bg-surface)", color:"var(--text-primary)",
  boxShadow:"var(--shadow-md)", fontSize:"12px",
};

function useCountUp(target, duration = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function AnimBar({ pct, color, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 300 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div style={{ flex:1, height:6, borderRadius:999, background:"var(--border-subtle)", overflow:"hidden" }}>
      <div style={{ height:"100%", borderRadius:999, background:color, width:`${width}%`, transition:"width 0.8s cubic-bezier(0.22,1,0.36,1)", boxShadow:`0 0 8px ${color}60` }} />
    </div>
  );
}

function KpiCard({ title, value, trend, pos, icon: KpiIcon, accent, spark, delay }) {
  const count = useCountUp(value);
  return (
    <div className={`anim-fade-in-up delay-${delay}`}
      style={{ background:"var(--bg-surface)", borderRadius:20, padding:"20px 22px", border:"1px solid var(--border)", display:"flex", flexDirection:"column", gap:4, position:"relative", overflow:"hidden", transition:"box-shadow 0.25s, transform 0.25s" }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow=`0 8px 32px ${accent}30`; e.currentTarget.style.transform="translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}
    >
      <div style={{ position:"absolute", top:-30, right:-30, width:100, height:100, borderRadius:"50%", background:`radial-gradient(circle, ${accent}20, transparent 70%)`, pointerEvents:"none" }} />
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:"var(--text-muted)" }}>{title}</p>
        <div style={{ width:36, height:36, borderRadius:10, flexShrink:0, background:`${accent}18`, display:"flex", alignItems:"center", justifyContent:"center", border:`1px solid ${accent}25` }}>
          <KpiIcon size={16} style={{ color:accent }} />
        </div>
      </div>
      <p style={{ fontSize:36, fontWeight:800, color:"var(--text-primary)", letterSpacing:"-0.03em", lineHeight:1 }}>{count}</p>
      <ResponsiveContainer width="100%" height={40}>
        <AreaChart data={spark}>
          <defs>
            <linearGradient id={`sg${accent.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accent} stopOpacity={0.3} />
              <stop offset="95%" stopColor={accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={accent} strokeWidth={2} dot={false} fill={`url(#sg${accent.replace("#","")})`} />
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
        <TrendingUp size={11} style={{ color: pos ? "#22c55e" : "#ef4444" }} />
        <p style={{ fontSize:11, fontWeight:600, color: pos ? "#22c55e" : "#ef4444" }}>{trend}</p>
      </div>
    </div>
  );
}

function Card({ children, delay=0, style={} }) {
  return (
    <div className={`anim-fade-in-up delay-${delay}`}
      style={{ background:"var(--bg-surface)", borderRadius:20, padding:"20px 22px", border:"1px solid var(--border)", transition:"box-shadow 0.25s, transform 0.25s", ...style }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow="0 8px 32px rgba(99,102,241,0.12)"; e.currentTarget.style.transform="translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, subtitle, badge }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16, gap:8 }}>
      <div>
        <p style={{ fontSize:14, fontWeight:700, color:"var(--text-primary)" }}>{title}</p>
        {subtitle && <p style={{ fontSize:12, color:"var(--text-muted)", marginTop:2 }}>{subtitle}</p>}
      </div>
      {badge}
    </div>
  );
}

function HeatCell({ cell, wi, di, color }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position:"relative", gridColumn:wi+1, gridRow:di+1, aspectRatio:"1" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <div style={{ width:"100%", height:"100%", borderRadius:4, background:color, transition:"transform 0.15s", transform:show?"scale(1.5)":"scale(1)", cursor:"pointer", boxShadow:show?`0 0 8px ${color}90`:cell.v>=3?`0 0 6px ${color}60`:"none", position:"relative", zIndex:show?10:"auto" }} />
      {show && (
        <div style={{ position:"absolute", left:"calc(100% + 6px)", top:"50%", transform:"translateY(-50%)", background:"var(--bg-surface)", border:"1px solid var(--border)", borderRadius:7, padding:"4px 9px", fontSize:11, fontWeight:600, color:"var(--text-primary)", boxShadow:"var(--shadow-md)", pointerEvents:"none", zIndex:9999, whiteSpace:"nowrap" }}>
          {cell.v} task{cell.v!==1?"s":""} · W{wi+1} {DAYS[di]}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { tasks, members, sprints, notifications } = useAppStore();

  // ── KPI values from real tasks ──
  const total      = tasks.length;
  const inProgress = tasks.filter(t => t.status === "in-progress").length;
  const done       = tasks.filter(t => t.status === "done").length;
  const critical   = tasks.filter(t => t.priority === "critical" && t.status !== "done").length;
  const doneRate   = total ? Math.round((done / total) * 100) : 0;
  const dueToday   = tasks.filter(t => t.dueDate === new Date().toISOString().split("T")[0]).length;

  // ── Sparklines: count per status over last 6 "snapshots" (simulated from task ids) ──
  const mkSpark = (filterFn) => {
    const filtered = tasks.filter(filterFn);
    const chunk = Math.max(1, Math.ceil(filtered.length / 6));
    return Array.from({ length: 6 }, (_, i) => ({ v: Math.min(chunk * (i + 1), filtered.length) }));
  };
  const sparkTotal    = Array.from({ length: 6 }, (_, i) => ({ v: Math.round(total * (i + 1) / 6) }));
  const sparkProgress = mkSpark(t => t.status === "in-progress");
  const sparkDone     = mkSpark(t => t.status === "done");
  const sparkCritical = mkSpark(t => t.priority === "critical");

  const kpiCards = [
    { title:"Total Tasks",     value:total,      trend:`${total} tasks in system`,       pos:true,  icon:CheckSquare,   accent:"#3b82f6", spark:sparkTotal    },
    { title:"In Progress",     value:inProgress, trend:`${dueToday} due today`,          pos:dueToday===0, icon:Clock,  accent:"#14b8a6", spark:sparkProgress },
    { title:"Completed",       value:done,       trend:`${doneRate}% completion rate`,   pos:true,  icon:CheckCircle,   accent:"#22c55e", spark:sparkDone     },
    { title:"Critical Issues", value:critical,   trend:`${critical} unresolved`,         pos:critical===0, icon:AlertTriangle, accent:"#ef4444", spark:sparkCritical },
  ];

  // ── Donut: task distribution by status ──
  const statusColors = { backlog:"#94a3b8", todo:"#3b82f6", "in-progress":"#10b981", review:"#8b5cf6", done:"#22c55e" };
  const donutData = Object.entries(statusColors).map(([status, color]) => ({
    name: status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1),
    value: tasks.filter(t => t.status === status).length,
    color,
  })).filter(d => d.value > 0);

  // ── Trend: group tasks by createdAt week ──
  const trendMap = {};
  tasks.forEach(t => {
    if (!t.createdAt) return;
    const d = new Date(t.createdAt);
    const week = `W${Math.ceil((d.getDate()) / 7)}`;
    if (!trendMap[week]) trendMap[week] = { week, created: 0, completed: 0 };
    trendMap[week].created++;
    if (t.status === "done") trendMap[week].completed++;
  });
  const trendData = Object.values(trendMap).slice(-8);

  // ── Active sprint ──
  const activeSprint = sprints.find(s => s.status === "active") || sprints[0];
  const sprintTasks  = activeSprint ? tasks.filter(t => t.sprintId === activeSprint.id) : [];
  const sprintTotal  = sprintTasks.length;
  const sprintDone   = sprintTasks.filter(t => t.status === "done").length;
  const sprintPct    = sprintTotal ? Math.round((sprintDone / sprintTotal) * 100) : 0;
  const sprintBreakdown = [
    { label:"Backlog",     color:"#94a3b8", count:sprintTasks.filter(t=>t.status==="backlog").length },
    { label:"To Do",       color:"#3b82f6", count:sprintTasks.filter(t=>t.status==="todo").length },
    { label:"In Progress", color:"#10b981", count:sprintTasks.filter(t=>t.status==="in-progress").length },
    { label:"In Review",   color:"#8b5cf6", count:sprintTasks.filter(t=>t.status==="review").length },
    { label:"Done",        color:"#22c55e", count:sprintDone },
  ];
  const sprintDonut = sprintBreakdown.filter(s => s.count > 0).map(s => ({ ...s, value: s.count }));

  // ── Weekly activity: tasks created per day of week ──
  const weeklyMap = { Mon:0, Tue:0, Wed:0, Thu:0, Fri:0, Sat:0, Sun:0 };
  tasks.forEach(t => {
    if (!t.createdAt) return;
    const day = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date(t.createdAt).getDay()];
    if (weeklyMap[day] !== undefined) weeklyMap[day]++;
  });
  const weeklyData = Object.entries(weeklyMap).map(([day, tasks]) => ({ day, tasks }));

  // ── Team workload: tasks assigned per member ──
  const teamWorkload = members.map(m => {
    const assigned = tasks.filter(t => t.assigneeId === m.id && t.status !== "done");
    const total    = tasks.filter(t => t.assigneeId === m.id).length;
    const pct      = total ? Math.round((assigned.length / Math.max(...members.map(mx => tasks.filter(t=>t.assigneeId===mx.id).length), 1)) * 100) : 0;
    return { ...m, bg: m.color, tasks: assigned.length, pct };
  }).filter(m => m.tasks > 0 || tasks.some(t => t.assigneeId === m.id));

  // ── Heatmap: based on real task createdAt dates ──
  const heatmap = Array.from({ length: 12 }, (_, wi) =>
    Array.from({ length: 7 }, (_, di) => {
      const count = tasks.filter(t => {
        if (!t.createdAt) return false;
        const d = new Date(t.createdAt);
        return d.getDay() === di && Math.floor(d.getDate() / 7) % 12 === wi % 12;
      }).length;
      return { v: Math.min(count, 4) };
    })
  );
  const totalContributions = tasks.length;

  // ── Live activity from notifications ──
  const liveActivity = notifications.slice(0, 6);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20, maxWidth:1600, margin:"0 auto" }}>

      {/* Row 1 — KPI */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:16 }}>
        {kpiCards.map((c, i) => <KpiCard key={c.title} {...c} delay={i * 50} />)}
      </div>

      {/* Row 2 — Trend + Donut */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:16 }} className="row2-grid">
        <Card delay={200}>
          <CardHeader title="Task Completion Trend" subtitle="Created vs completed by week"
            badge={
              <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, fontWeight:600, color:"#22c55e", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:999, padding:"4px 10px" }}>
                <Activity size={11} /> Live
              </div>
            }
          />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="week" tick={{ fontSize:11, fill:"var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:"var(--text-muted)" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={tt} />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize:"11px", paddingBottom:"8px" }} />
              <Area type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={2.5} dot={false} fill="url(#gCompleted)" name="Completed" />
              <Area type="monotone" dataKey="created"   stroke="#8b5cf6" strokeWidth={2.5} dot={false} fill="url(#gCreated)"   name="Created" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card delay={250}>
          <CardHeader title="Task Distribution" subtitle="By current status" />
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={donutData} cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={4} dataKey="value">
                {donutData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={tt} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px 12px", marginTop:12 }}>
            {donutData.map(item => (
              <div key={item.name} style={{ display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ width:8, height:8, borderRadius:"50%", flexShrink:0, background:item.color, boxShadow:`0 0 6px ${item.color}80` }} />
                <span style={{ fontSize:12, color:"var(--text-muted)" }}>{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3 — Sprint + Activity + Weekly */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16 }}>

        {/* Sprint Progress */}
        <Card delay={300}>
          <CardHeader title={activeSprint ? `${activeSprint.name} Progress` : "No Active Sprint"} subtitle={`${sprintDone} / ${sprintTotal} tasks done`} />
          <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
            <div style={{ position:"relative", width:120, height:120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sprintDonut.length ? sprintDonut : [{ name:"Empty", value:1, color:"var(--border)" }]}
                    cx="50%" cy="50%" innerRadius={38} outerRadius={56} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                    {(sprintDonut.length ? sprintDonut : [{ color:"var(--border)" }]).map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:20, fontWeight:800, color:"var(--text-primary)" }}>{sprintPct}%</span>
                <span style={{ fontSize:11, color:"var(--text-muted)" }}>Complete</span>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {sprintBreakdown.map((item, i) => (
              <div key={item.label} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:8, height:8, borderRadius:"50%", flexShrink:0, background:item.color, boxShadow:`0 0 6px ${item.color}80` }} />
                <span style={{ fontSize:12, color:"var(--text-muted)", width:76, flexShrink:0 }}>{item.label}</span>
                <AnimBar pct={sprintTotal ? Math.round((item.count/sprintTotal)*100) : 0} color={item.color} delay={i*80} />
                <span style={{ fontSize:11, color:"var(--text-muted)", width:20, textAlign:"right", flexShrink:0 }}>{item.count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Live Activity */}
        <Card delay={350}>
          <CardHeader title="Live Activity"
            badge={
              <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"var(--text-muted)", background:"var(--bg-surface2)", border:"1px solid var(--border)", borderRadius:999, padding:"4px 10px", flexShrink:0 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", animation:"glowPulse 2s ease-in-out infinite" }} />
                Real-time
              </div>
            }
          />
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {liveActivity.length === 0 && (
              <p style={{ fontSize:12, color:"var(--text-muted)", textAlign:"center", padding:"16px 0" }}>No activity yet</p>
            )}
            {liveActivity.map((n, i) => {
              const member = members.find(m => n.text.includes(m.name)) || members[i % members.length];
              return (
                <div key={n.id} className={`anim-fade-in-up delay-${400 + i * 60}`} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                  <div style={{ width:30, height:30, borderRadius:8, flexShrink:0, background:`linear-gradient(135deg, ${member?.color||"#6366f1"}, ${member?.color||"#6366f1"}99)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:700, boxShadow:`0 2px 8px ${member?.color||"#6366f1"}50` }}>
                    {member?.initials || "?"}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:12, color:"var(--text-secondary)", lineHeight:1.5 }}>{n.text}</p>
                    <p style={{ fontSize:11, color:"var(--text-muted)", marginTop:2 }}>{n.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Weekly Activity */}
        <Card delay={400}>
          <CardHeader title="Weekly Activity" subtitle="Tasks created per day" />
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={weeklyData} barSize={22}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize:11, fill:"var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:"var(--text-muted)" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={tt} />
              <Bar dataKey="tasks" fill="url(#barGrad)" radius={[6,6,0,0]} name="Tasks" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 4 — Heatmap + Workload */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card delay={450}>
          <CardHeader title="Contribution Activity" subtitle="Based on task creation dates"
            badge={
              <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:600, color:"#6366f1", background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:999, padding:"4px 10px" }}>
                <Zap size={11} /> {totalContributions} contributions
              </div>
            }
          />
          <div style={{ display:"grid", gridTemplateColumns:`repeat(${heatmap.length}, 1fr)`, gridTemplateRows:"repeat(7, 1fr)", gap:3, width:"100%" }}>
            {heatmap.map((week, wi) =>
              week.map((cell, di) => (
                <HeatCell key={`${wi}-${di}`} cell={cell} wi={wi} di={di} color={heatColors[cell.v]} />
              ))
            )}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:12 }}>
            <span style={{ fontSize:11, color:"var(--text-muted)" }}>Less</span>
            {heatColors.map((c, i) => <div key={i} style={{ width:12, height:12, borderRadius:4, background:c, boxShadow:i>=3?`0 0 4px ${c}80`:"none" }} />)}
            <span style={{ fontSize:11, color:"var(--text-muted)" }}>More</span>
          </div>
        </Card>

        <Card delay={500}>
          <CardHeader title="Team Workload" subtitle="Active tasks per member" />
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {teamWorkload.length === 0 && (
              <p style={{ fontSize:12, color:"var(--text-muted)", textAlign:"center", padding:"16px 0" }}>No assignments yet</p>
            )}
            {teamWorkload.map((m, i) => (
              <div key={m.id} className={`anim-fade-in-up delay-${500 + i * 50}`} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:9, flexShrink:0, background:`linear-gradient(135deg, ${m.bg}, ${m.bg}99)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:700, boxShadow:`0 2px 8px ${m.bg}50` }}>
                  {m.initials}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontSize:12, fontWeight:600, color:"var(--text-primary)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.name}</span>
                    <span style={{ fontSize:11, color:"var(--text-muted)", flexShrink:0, marginLeft:8 }}>{m.tasks} active</span>
                  </div>
                  <AnimBar pct={m.pct} color={m.bg} delay={i * 60} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <style>{`
        @media (min-width: 1024px) { .row2-grid { grid-template-columns: 2fr 1fr !important; } }
      `}</style>
    </div>
  );
}
