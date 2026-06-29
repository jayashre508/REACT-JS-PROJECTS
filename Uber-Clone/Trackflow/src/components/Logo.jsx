export default function Logo({ size = 32, showText = true, textSize = "text-xl" }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* SVG Icon */}
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGrad1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <linearGradient id="logoGrad2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        {/* Background rounded square */}
        <rect width="40" height="40" rx="10" fill="url(#logoGrad1)" />
        {/* Track lines */}
        <rect x="8" y="11" width="16" height="3" rx="1.5" fill="white" opacity="0.9" />
        <rect x="8" y="18.5" width="24" height="3" rx="1.5" fill="white" opacity="0.7" />
        <rect x="8" y="26" width="12" height="3" rx="1.5" fill="white" opacity="0.5" />
        {/* Checkmark circle */}
        <circle cx="31" cy="12.5" r="5" fill="white" opacity="0.15" />
        <path d="M28.5 12.5 L30.5 14.5 L33.5 11" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {showText && (
        <span className={`${textSize} font-bold tracking-tight bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent`}>
          TrackFlow
        </span>
      )}
    </div>
  );
}
