interface BambooStalkProps {
  size?: number;
  height?: number;
}

export function BambooStalk({ size = 40, height = 60 }: BambooStalkProps) {
  const baseY = height - 8;
  const stalkTop = 6;
  
  return (
    <svg width={size} height={height} viewBox={`0 0 ${size} ${height}`} className="absolute">
      {/* Ground/base area */}
      <ellipse 
        cx={size/2} 
        cy={baseY + 2} 
        rx={size * 0.4} 
        ry="3" 
        fill="none" 
        stroke="#654321" 
        strokeWidth="1" 
        opacity="0.5"
      />
      
      {/* Small root lines coming from base */}
      <line x1={size/2 - 4} y1={baseY} x2={size/2 - 6} y2={baseY + 4} stroke="#654321" strokeWidth="0.8" opacity="0.4" />
      <line x1={size/2 + 4} y1={baseY} x2={size/2 + 6} y2={baseY + 4} stroke="#654321" strokeWidth="0.8" opacity="0.4" />
      
      {/* Main bamboo stalk - vertical line */}
      <line 
        x1={size/2} 
        y1={stalkTop} 
        x2={size/2} 
        y2={baseY} 
        stroke="#8b4513" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      
      {/* Bamboo nodes - horizontal lines at joints */}
      <line x1={size/2 - 3} y1={stalkTop + 10} x2={size/2 + 3} y2={stalkTop + 10} stroke="#654321" strokeWidth="1.5" strokeLinecap="round" />
      <line x1={size/2 - 3} y1={stalkTop + 20} x2={size/2 + 3} y2={stalkTop + 20} stroke="#654321" strokeWidth="1.5" strokeLinecap="round" />
      <line x1={size/2 - 3} y1={stalkTop + 30} x2={size/2 + 3} y2={stalkTop + 30} stroke="#654321" strokeWidth="1.5" strokeLinecap="round" />
      {height > 50 && <line x1={size/2 - 3} y1={stalkTop + 40} x2={size/2 + 3} y2={stalkTop + 40} stroke="#654321" strokeWidth="1.5" strokeLinecap="round" />}
      {height > 60 && <line x1={size/2 - 3} y1={stalkTop + 50} x2={size/2 + 3} y2={stalkTop + 50} stroke="#654321" strokeWidth="1.5" strokeLinecap="round" />}
      
      {/* Subtle texture lines on the stalk */}
      <line x1={size/2 - 1} y1={stalkTop + 4} x2={size/2 - 1} y2={stalkTop + 8} stroke="#8b4513" strokeWidth="0.5" opacity="0.6" />
      <line x1={size/2 + 1} y1={stalkTop + 14} x2={size/2 + 1} y2={stalkTop + 18} stroke="#8b4513" strokeWidth="0.5" opacity="0.6" />
      <line x1={size/2 - 1} y1={stalkTop + 24} x2={size/2 - 1} y2={stalkTop + 28} stroke="#8b4513" strokeWidth="0.5" opacity="0.6" />
    </svg>
  );
}

interface TikiMaskProps {
  size?: number;
}

export function TikiMask({ size = 32 }: TikiMaskProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 40" className="absolute">
      {/* Main mask outline - sketchy style */}
      <path
        d="M16 2 C12 2 8 4 6 8 L6 28 C6 32 8 36 12 38 L20 38 C24 36 26 32 26 28 L26 8 C24 4 20 2 16 2 Z"
        fill="none"
        stroke="#8b4513"
        strokeWidth="1.5"
        opacity="0.7"
      />

      {/* Eyes - sketchy outlines */}
      <ellipse cx="12" cy="12" rx="2" ry="3" fill="none" stroke="#654321" strokeWidth="1.2" />
      <ellipse cx="20" cy="12" rx="2" ry="3" fill="none" stroke="#654321" strokeWidth="1.2" />
      
      {/* Eye pupils - small strokes */}
      <line x1="12" y1="11" x2="12" y2="13" stroke="#654321" strokeWidth="1" />
      <line x1="20" y1="11" x2="20" y2="13" stroke="#654321" strokeWidth="1" />

      {/* Nose - triangular sketch */}
      <path d="M16 16 L14 20 L16 22 L18 20 Z" fill="none" stroke="#654321" strokeWidth="1" />
      <line x1="16" y1="18" x2="16" y2="20" stroke="#654321" strokeWidth="0.8" />

      {/* Mouth - rectangular with teeth marks */}
      <rect x="13" y="26" width="6" height="4" rx="1" fill="none" stroke="#654321" strokeWidth="1.2" />
      <line x1="14" y1="27" x2="14" y2="29" stroke="#654321" strokeWidth="0.6" />
      <line x1="16" y1="27" x2="16" y2="29" stroke="#654321" strokeWidth="0.6" />
      <line x1="18" y1="27" x2="18" y2="29" stroke="#654321" strokeWidth="0.6" />

      {/* Wood grain lines - sketchy texture */}
      <g stroke="#8b4513" strokeWidth="0.5" fill="none" opacity="0.5" strokeLinecap="round">
        <path d="M8 6 Q16 7 24 6" />
        <path d="M7 10 Q16 11 25 10" />
        <path d="M7 14 Q16 15 25 14" />
        <path d="M8 18 Q16 19 24 18" />
        <path d="M8 22 Q16 23 24 22" />
        <path d="M8 26 Q16 27 24 26" />
        <path d="M9 30 Q16 31 23 30" />
        <path d="M11 34 Q16 35 21 34" />
      </g>

      {/* Carved detail marks */}
      <circle cx="16" cy="8" r="1" fill="none" stroke="#654321" strokeWidth="0.8" opacity="0.6" />
      <line x1="10" y1="24" x2="11" y2="25" stroke="#654321" strokeWidth="0.8" opacity="0.6" />
      <line x1="21" y1="24" x2="22" y2="25" stroke="#654321" strokeWidth="0.8" opacity="0.6" />
      
      {/* Additional carved lines for authenticity */}
      <line x1="9" y1="15" x2="10" y2="17" stroke="#654321" strokeWidth="0.6" opacity="0.5" />
      <line x1="22" y1="15" x2="23" y2="17" stroke="#654321" strokeWidth="0.6" opacity="0.5" />
    </svg>
  );
}
