export default function SkeletonBlock({ lines = 3 }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          className="h-3 rounded-full"
          style={{
            width: `${92 - index * 12}%`,
            background: "linear-gradient(90deg, var(--bg-surface2), var(--border-subtle), var(--bg-surface2))",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.2s linear infinite",
          }}
        />
      ))}
    </div>
  );
}
