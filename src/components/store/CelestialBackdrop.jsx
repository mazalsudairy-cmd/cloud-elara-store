import React from 'react';

/**
 * Subtle armillary / constellation layer matching the Elara celestial brand.
 * Pure SVG — no network; sits behind content with pointer-events none.
 */
export default function CelestialBackdrop({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <svg className="h-full w-full opacity-[0.55]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 800">
        <defs>
          <radialGradient id="elara-celestial-glow" cx="50%" cy="42%" r="65%">
            <stop offset="0%" stopColor="rgba(185, 155, 95, 0.14)" />
            <stop offset="45%" stopColor="rgba(185, 155, 95, 0.04)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="elara-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(212, 190, 130, 0.35)" />
            <stop offset="100%" stopColor="rgba(160, 130, 80, 0.12)" />
          </linearGradient>
        </defs>
        <rect width="1200" height="800" fill="url(#elara-celestial-glow)" />
        {/* Armillary-style arcs */}
        <ellipse cx="600" cy="380" rx="340" ry="300" fill="none" stroke="url(#elara-line)" strokeWidth="0.6" opacity="0.9" />
        <ellipse cx="600" cy="380" rx="260" ry="220" fill="none" stroke="rgba(200, 175, 120, 0.14)" strokeWidth="0.45" />
        <ellipse cx="600" cy="380" rx="420" ry="200" fill="none" stroke="rgba(200, 175, 120, 0.1)" strokeWidth="0.35" transform="rotate(-12 600 380)" />
        {/* Meridian */}
        <ellipse cx="600" cy="380" rx="320" ry="320" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.35" transform="rotate(88 600 380)" />
        {/* Constellation polylines */}
        <g stroke="rgba(255,255,255,0.14)" strokeWidth="0.55" fill="none" strokeLinecap="round">
          <polyline points="120,140 165,118 210,155 248,132 280,168" />
          <polyline points="880,120 920,95 960,130 1005,108 1040,145" />
          <polyline points="150,520 195,495 230,535 275,505 310,540" />
          <polyline points="900,520 940,498 985,532 1025,508 1065,548" />
        </g>
        <g fill="rgba(255,255,255,0.35)">
          <circle cx="120" cy="140" r="1.2" />
          <circle cx="248" cy="132" r="0.9" />
          <circle cx="920" cy="95" r="1.1" />
          <circle cx="1005" cy="108" r="0.8" />
          <circle cx="195" cy="495" r="1" />
          <circle cx="275" cy="505" r="0.85" />
          <circle cx="940" cy="498" r="1" />
          <circle cx="1025" cy="508" r="0.75" />
          <circle cx="600" cy="120" r="1.3" />
          <circle cx="480" cy="620" r="0.9" />
          <circle cx="720" cy="640" r="1" />
        </g>
        <g fill="rgba(212, 190, 130, 0.45)">
          <circle cx="340" cy="220" r="1.4" />
          <circle cx="860" cy="260" r="1.2" />
          <circle cx="520" cy="180" r="1" />
        </g>
      </svg>
    </div>
  );
}
