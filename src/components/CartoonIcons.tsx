interface IconProps {
  size?: number;
  color?: string;
}

export function StarIcon({ size = 36, color = '#FFB703' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="dash-icon">
      <path d="M32 4 L40.5 22 L60 24.5 L45.5 38.5 L50 58 L32 48 L14 58 L18.5 38.5 L4 24.5 L23.5 22 Z" fill={color} stroke="rgba(0, 0, 0, 0.18)" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="27" cy="22" r="1.8" fill="rgba(255, 255, 255, 0.6)" />
    </svg>
  );
}

export function SunIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="dash-icon">
      <g stroke="#F9A825" strokeWidth="3.5" strokeLinecap="round">
        <line x1="32" y1="6" x2="32" y2="12" />
        <line x1="32" y1="52" x2="32" y2="58" />
        <line x1="6" y1="32" x2="12" y2="32" />
        <line x1="52" y1="32" x2="58" y2="32" />
        <line x1="13.6" y1="13.6" x2="18" y2="18" />
        <line x1="46" y1="46" x2="50.4" y2="50.4" />
        <line x1="13.6" y1="50.4" x2="18" y2="46" />
        <line x1="46" y1="18" x2="50.4" y2="13.6" />
      </g>
      <circle cx="32" cy="32" r="14" fill="#FFD54F" stroke="#F9A825" strokeWidth="2.5" />
      <circle cx="27" cy="28" r="1.8" fill="rgba(255, 255, 255, 0.7)" />
      <path d="M26 36 Q32 40.5 38 36" fill="none" stroke="#F57F17" strokeWidth="2" strokeLinecap="round" />
      <circle cx="23" cy="36" r="1.8" fill="#F57F17" />
      <circle cx="41" cy="36" r="1.8" fill="#F57F17" />
    </svg>
  );
}

export function MoneyBagIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="dash-icon">
      <path d="M18 30 C16 50 21 54 32 54 C43 54 48 50 46 30 C46 26 40 24 32 24 C24 24 18 26 18 30 Z" fill="#66BB6A" stroke="#2E7D32" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M26 24 C26 20 29 17 32 17 C35 17 38 20 38 24" fill="none" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" />
      <text x="32" y="39" textAnchor="middle" fontSize="14" fontWeight="900" fill="#FFD54F" fontFamily="Arial, sans-serif">$</text>
      <circle cx="27" cy="46" r="1.5" fill="#1B5E20" />
      <circle cx="37" cy="46" r="1.5" fill="#1B5E20" />
      <path d="M28 50 Q32 52.5 36 50" fill="none" stroke="#1B5E20" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function BrokenCigaretteIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="dash-icon">
      <circle cx="32" cy="32" r="21" fill="#FFCDD2" stroke="#E53935" strokeWidth="3" />
      <line x1="18" y1="18" x2="46" y2="46" stroke="#E53935" strokeWidth="3.5" strokeLinecap="round" />
      <g transform="rotate(-25 32 32)">
        <rect x="21" y="28" width="23" height="7" rx="3" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="1.5" />
        <rect x="40" y="28" width="6" height="7" rx="2" fill="#FF9800" />
        <line x1="31" y1="28" x2="29" y2="35" stroke="#90A4AE" strokeWidth="1.5" />
        <line x1="35" y1="28" x2="33" y2="35" stroke="#90A4AE" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function SmilingHeartIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="dash-icon">
      <path d="M32 56 C14 44 8 32 14 22 C19 13 29 14 32 20 C35 14 45 13 50 22 C56 32 50 44 32 56 Z" fill="#FF5A79" stroke="#D81B60" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="25" cy="30" r="2.2" fill="#4A0011" />
      <circle cx="39" cy="30" r="2.2" fill="#4A0011" />
      <path d="M27 38 Q32 43.5 37 38" fill="none" stroke="#4A0011" strokeWidth="2" strokeLinecap="round" />
      <circle cx="21" cy="35" r="2.2" fill="#FF8A9C" />
      <circle cx="43" cy="35" r="2.2" fill="#FF8A9C" />
    </svg>
  );
}

export function ClockFaceIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="dash-icon">
      <path d="M20 12 C20 5 28 5 28 12" fill="#FFD54F" stroke="#F9A825" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M36 12 C36 5 44 5 44 12" fill="#FFD54F" stroke="#F9A825" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="9" r="2" fill="#F9A825" />
      <circle cx="40" cy="9" r="2" fill="#F9A825" />
      <circle cx="32" cy="33" r="23" fill="#81D4FA" stroke="#0288D1" strokeWidth="3" />
      <line x1="32" y1="33" x2="32" y2="21" stroke="#0288D1" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="33" x2="42" y2="37" stroke="#0288D1" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="33" r="2.5" fill="#0288D1" />
      <circle cx="26" cy="39" r="1.6" fill="#01579B" />
      <circle cx="38" cy="39" r="1.6" fill="#01579B" />
      <path d="M28 43 Q32 45.5 36 43" fill="none" stroke="#01579B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function TargetIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="dash-icon">
      <line x1="42" y1="32" x2="42" y2="14" stroke="#8D6E63" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M42 14 L54 18 L42 22 Z" fill="#66BB6A" stroke="#388E3C" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="32" cy="40" r="18" fill="#EF5350" stroke="#C62828" strokeWidth="2" />
      <circle cx="32" cy="40" r="12" fill="#FFFFFF" stroke="#C62828" strokeWidth="2" />
      <circle cx="32" cy="40" r="6" fill="#42A5F5" stroke="#1565C0" strokeWidth="2" />
    </svg>
  );
}

export function OpenBookIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="dash-icon">
      <path d="M32 17 C26 13 16 13 10 15 L10 45 C16 43 26 43 32 47 Z" fill="#E3F2FD" stroke="#1E88E5" strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 17 C38 13 48 13 54 15 L54 45 C48 43 38 43 32 47 Z" fill="#E3F2FD" stroke="#1E88E5" strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 17 L32 47" stroke="#1E88E5" strokeWidth="1.5" />
      <line x1="16" y1="22" x2="27" y2="22" stroke="#90CAF9" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="16" y1="28" x2="28" y2="28" stroke="#90CAF9" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="16" y1="34" x2="26" y2="34" stroke="#90CAF9" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="37" y1="22" x2="48" y2="22" stroke="#90CAF9" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="36" y1="28" x2="48" y2="28" stroke="#90CAF9" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="38" y1="34" x2="48" y2="34" stroke="#90CAF9" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function HourglassIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="dash-icon">
      <line x1="18" y1="12" x2="46" y2="12" stroke="#8D6E63" strokeWidth="3" strokeLinecap="round" />
      <line x1="18" y1="52" x2="46" y2="52" stroke="#8D6E63" strokeWidth="3" strokeLinecap="round" />
      <path d="M22 14 L42 14 L34 32 L42 50 L22 50 L30 32 Z" fill="#FFE0B2" stroke="#F9A825" strokeWidth="2" strokeLinejoin="round" />
      <path d="M23 16 L41 16 L34 30 L30 30 Z" fill="#FFB74D" />
      <path d="M34 34 L30 34 L24 48 L40 48 Z" fill="#FFB74D" />
      <line x1="32" y1="30" x2="32" y2="36" stroke="#FFB74D" strokeWidth="1.5" />
      <circle cx="24" cy="13" r="1.8" fill="#8D6E63" />
      <circle cx="40" cy="13" r="1.8" fill="#8D6E63" />
      <circle cx="24" cy="51" r="1.8" fill="#8D6E63" />
      <circle cx="40" cy="51" r="1.8" fill="#8D6E63" />
    </svg>
  );
}

export function StopHandIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="dash-icon">
      <rect x="17" y="30" width="7" height="17" rx="3.5" fill="#FFCCBC" stroke="#8D6E63" strokeWidth="2" />
      <rect x="24" y="26" width="25" height="25" rx="9" fill="#FFCCBC" stroke="#8D6E63" strokeWidth="2" />
      <rect x="24" y="11" width="5" height="17" rx="2.5" fill="#FFCCBC" stroke="#8D6E63" strokeWidth="2" />
      <rect x="31" y="9" width="5" height="19" rx="2.5" fill="#FFCCBC" stroke="#8D6E63" strokeWidth="2" />
      <rect x="38" y="11" width="5" height="17" rx="2.5" fill="#FFCCBC" stroke="#8D6E63" strokeWidth="2" />
      <rect x="45" y="14" width="5" height="14" rx="2.5" fill="#FFCCBC" stroke="#8D6E63" strokeWidth="2" />
      <circle cx="37" cy="42" r="8" fill="#E53935" stroke="#B71C1C" strokeWidth="2" />
      <text x="37" y="46.5" textAnchor="middle" fontSize="10" fontWeight="900" fill="white" fontFamily="Arial, sans-serif">!</text>
    </svg>
  );
}

export function LungsIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="dash-icon">
      <rect x="30" y="12" width="4" height="12" rx="2" fill="#EF9A9A" stroke="#C62828" strokeWidth="1.5" />
      <path d="M20 18 C8 18 8 40 12 47 C16 54 25 51 27 42 C29 35 27 25 24 20 C23 18 21 18 20 18 Z" fill="#FF8A80" stroke="#C62828" strokeWidth="2" strokeLinejoin="round" />
      <path d="M44 18 C56 18 56 40 52 47 C48 54 39 51 37 42 C35 35 37 25 40 20 C41 18 43 18 44 18 Z" fill="#FF8A80" stroke="#C62828" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function DropletIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="dash-icon">
      <path d="M32 6 C32 6 13 30 13 42 C13 53 21 58 32 58 C43 58 51 53 51 42 C51 30 32 6 32 6 Z" fill="#4FC3F7" stroke="#0288D1" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="26" cy="36" r="2.2" fill="#01579B" />
      <circle cx="38" cy="36" r="2.2" fill="#01579B" />
      <path d="M27 44 Q32 48 37 44" fill="none" stroke="#01579B" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function TasteFaceIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="dash-icon">
      <circle cx="32" cy="30" r="22" fill="#FFE082" stroke="#F9A825" strokeWidth="2.5" />
      <circle cx="25" cy="27" r="2.5" fill="#8D6E63" />
      <circle cx="39" cy="27" r="2.5" fill="#8D6E63" />
      <path d="M24 37 Q32 43 40 37" fill="none" stroke="#8D6E63" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 41 C35 40 37 46 32 48 C27 50 25 43 30 41 Z" fill="#EF5350" stroke="#C62828" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function BreathingIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="dash-icon">
      <circle cx="32" cy="32" r="22" fill="#81D4FA" stroke="#0288D1" strokeWidth="2.5" />
      <path d="M15 26 Q10 28 15 30 Q20 32 15 34" fill="none" stroke="#01579B" strokeWidth="2" strokeLinecap="round" />
      <path d="M49 26 Q54 28 49 30 Q44 32 49 34" fill="none" stroke="#01579B" strokeWidth="2" strokeLinecap="round" />
      <circle cx="26" cy="36" r="2" fill="#01579B" />
      <circle cx="38" cy="36" r="2" fill="#01579B" />
      <path d="M27 42 Q32 45.5 37 42" fill="none" stroke="#01579B" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function HeartbeatIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="dash-icon">
      <path d="M32 54 C14 42 8 30 14 20 C19 11 29 12 32 18 C35 12 45 11 50 20 C56 30 50 42 32 54 Z" fill="#FF8A80" stroke="#E53935" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M15 34 L24 34 L27 29 L31 39 L34 28 L37 34 L49 34" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CleanLungsIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="dash-icon">
      <rect x="30" y="12" width="4" height="10" rx="2" fill="#C8E6C9" stroke="#388E3C" strokeWidth="1.5" />
      <path d="M20 20 C8 20 8 40 12 47 C16 53 25 50 27 42 C29 35 27 26 24 21 C23 20 21 20 20 20 Z" fill="#A5D6A7" stroke="#388E3C" strokeWidth="2" strokeLinejoin="round" />
      <path d="M44 20 C56 20 56 40 52 47 C48 53 39 50 37 42 C35 35 37 26 40 21 C41 20 43 20 44 20 Z" fill="#A5D6A7" stroke="#388E3C" strokeWidth="2" strokeLinejoin="round" />
      <path d="M19 8 L20.5 12 L24.5 13.5 L20.5 15 L19 19 L17.5 15 L13.5 13.5 L17.5 12 Z" fill="#FFD54F" />
      <path d="M48 10 L49 13 L52 14 L49 15 L48 18 L47 15 L44 14 L47 13 Z" fill="#FFD54F" />
    </svg>
  );
}

export function ShieldHeartIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="dash-icon">
      <path d="M32 4 C32 4 14 12 14 30 C14 48 32 60 32 60 C32 60 50 48 50 30 C50 12 32 4 32 4 Z" fill="#81D4FA" stroke="#0288D1" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 50 C20 41 16 32 20 25 C24 19 30 19 32 23 C34 19 40 19 44 25 C48 32 44 41 32 50 Z" fill="#FF5A79" stroke="#C2185B" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function BrainIcon({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="dash-icon">
      <path d="M14 24 C6 22 6 34 12 36 C8 44 18 50 22 44 C26 52 38 52 42 44 C46 50 56 44 52 36 C58 34 58 22 50 24 C50 16 38 14 36 22 C34 14 22 16 24 22 C20 16 14 18 14 24 Z" fill="#F8BBD0" stroke="#C2185B" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 30 L28 30 L30 27 L32 33 L34 26 L36 30 L40 30" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="44" r="2.5" fill="#C2185B" opacity="0.5" />
      <circle cx="48" cy="44" r="2.5" fill="#C2185B" opacity="0.5" />
    </svg>
  );
}
