export default function InsightCard({ label, value, detail, tone = "blue", icon: Icon }) {
  const tones = {
    blue: ["#2563eb", "rgba(37,99,235,0.1)"],
    green: ["#059669", "rgba(5,150,105,0.1)"],
    amber: ["#d97706", "rgba(217,119,6,0.12)"],
    red: ["#dc2626", "rgba(220,38,38,0.1)"],
    violet: ["#7c3aed", "rgba(124,58,237,0.1)"],
  };
  const [color, bg] = tones[tone] || tones.blue;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-hover">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</p>
          <p className="text-3xl font-black text-gray-900 mt-2">{value}</p>
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ color, background: bg }}>
            <Icon size={18} />
          </div>
        )}
      </div>
      {detail && <p className="text-xs text-gray-500 mt-3 leading-5">{detail}</p>}
    </div>
  );
}
