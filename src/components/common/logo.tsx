export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Globe outer ring */}
      <circle
        cx="16"
        cy="16"
        r="13"
        stroke="#f59e0b"
        strokeWidth="1.5"
        strokeOpacity="0.35"
      />

      {/* Globe meridian (vertical ellipse) */}
      <ellipse
        cx="16"
        cy="16"
        rx="6.5"
        ry="13"
        stroke="#f59e0b"
        strokeWidth="1"
        strokeOpacity="0.3"
      />

      {/* Globe equator */}
      <line
        x1="3"
        y1="16"
        x2="29"
        y2="16"
        stroke="#f59e0b"
        strokeWidth="1"
        strokeOpacity="0.3"
      />

      {/* Connection lines: center → 3 nodes */}
      <line x1="16" y1="16" x2="16" y2="5"  stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.65" strokeLinecap="round" />
      <line x1="16" y1="16" x2="26" y2="22" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.65" strokeLinecap="round" />
      <line x1="16" y1="16" x2="6"  y2="22" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.65" strokeLinecap="round" />

      {/* Center node — the source */}
      <circle cx="16" cy="16" r="3" fill="#f59e0b" />

      {/* Peripheral nodes — the world */}
      <circle cx="16" cy="5"  r="2" fill="#f59e0b" fillOpacity="0.85" />
      <circle cx="26" cy="22" r="2" fill="#f59e0b" fillOpacity="0.85" />
      <circle cx="6"  cy="22" r="2" fill="#f59e0b" fillOpacity="0.85" />
    </svg>
  )
}
