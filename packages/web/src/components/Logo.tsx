export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Speech bubble */}
      <path d="M4 6C4 4.9 4.9 4 6 4H26C27.1 4 28 4.9 28 6V22C28 23.1 27.1 24 26 24H18L12 29V24H6C4.9 24 4 23.1 4 22V6Z" fill="#FCBF24" stroke="#1a1c1c" strokeWidth="2" strokeLinejoin="round" />
      {/* M letter */}
      <text x="16" y="18" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="14" fill="#1a1c1c">M</text>
    </svg>
  );
}
