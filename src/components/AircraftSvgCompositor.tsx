import React from 'react';
import { AIRLINES_MAP, DEFAULT_AIRLINE } from '../services/airlinesData';

interface AircraftSvgCompositorProps {
  model: string;
  airlineCode: string;
  className?: string;
}

export const AircraftSvgCompositor: React.FC<AircraftSvgCompositorProps> = ({
  model,
  airlineCode,
  className = 'w-full h-auto max-h-[320px]',
}) => {
  const airline = AIRLINES_MAP[airlineCode] || DEFAULT_AIRLINE;
  const primaryColor = airline.primaryColor;
  const secondaryColor = airline.secondaryColor;
  const accentColor = airline.accentColor;

  // Raw high-detail vector profiles for Airbus & Boeing models with injectable livery CSS groups
  const isLargeWidebody = ['A388', 'B777', 'A359'].includes(model.toUpperCase());

  return (
    <div className={`relative flex items-center justify-center p-4 ${className}`}>
      <svg
        viewBox="0 0 800 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] filter transition-all duration-700 ease-in-out"
      >
        <defs>
          {/* Metallic / Glossy Fuselage Gradient */}
          <linearGradient id="fuselageGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#E2E8F0" stopOpacity="0.90" />
            <stop offset="75%" stopColor="#CBD5E1" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.80" />
          </linearGradient>

          {/* Engine Turbine Gradient */}
          <linearGradient id="engineGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="60%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Dynamic Tail Livery Gradient */}
          <linearGradient id="tailLiveryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>

          {/* Dynamic Cheatline Stripe Gradient */}
          <linearGradient id="stripeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.1" />
            <stop offset="30%" stopColor={primaryColor} />
            <stop offset="70%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={accentColor} />
          </linearGradient>
        </defs>

        {/* --- 1. Aircraft Fuselage Body --- */}
        {isLargeWidebody ? (
          // Widebody profile (A380 / B777 / A359)
          <path
            d="M 680 130 C 620 130, 480 128, 260 128 C 160 128, 110 125, 60 110 C 35 100, 20 85, 20 75 C 25 60, 50 50, 100 48 C 220 45, 480 45, 630 55 C 710 60, 760 85, 775 105 C 785 118, 740 130, 680 130 Z"
            fill="url(#fuselageGlow)"
            stroke="#64748B"
            strokeWidth="1.5"
          />
        ) : (
          // Narrowbody profile (A320 / B738 / A333)
          <path
            d="M 670 125 C 600 125, 460 123, 250 123 C 150 123, 100 120, 55 108 C 30 98, 18 85, 18 75 C 22 62, 45 52, 95 50 C 210 48, 460 48, 620 56 C 700 60, 750 82, 768 102 C 778 114, 730 125, 670 125 Z"
            fill="url(#fuselageGlow)"
            stroke="#64748B"
            strokeWidth="1.5"
          />
        )}

        {/* --- 2. Dynamic Tail Fin (Vertical Stabilizer) with Airline Color Injection --- */}
        <g id="livery-tail-fin">
          <path
            d="M 610 52 L 725 5 L 765 8 C 765 8, 745 42, 705 60 Z"
            fill="url(#tailLiveryGrad)"
            stroke={primaryColor}
            strokeWidth="1"
          />
          {/* Accent Stripe on Tail */}
          <path
            d="M 660 30 L 730 5 L 742 8 L 685 45 Z"
            fill={accentColor}
            opacity="0.85"
          />
          {/* Tail Logo Code initials */}
          <text
            x="715"
            y="35"
            fill={accentColor}
            fontSize="16"
            fontWeight="bold"
            fontFamily="Outfit, sans-serif"
            textAnchor="middle"
            transform="rotate(-25 715 35)"
          >
            {airline.code}
          </text>
        </g>

        {/* --- 3. Dynamic Fuselage Airline Stripe / Cheatline Injection --- */}
        <g id="livery-stripe">
          <path
            d="M 120 78 C 250 75, 450 75, 630 70 C 650 70, 680 65, 710 58 L 715 65 C 685 75, 650 80, 630 80 C 450 85, 250 85, 120 88 Z"
            fill="url(#stripeGrad)"
          />
          {/* Airline Brand Title on Fuselage */}
          <text
            x="320"
            y="70"
            fill={primaryColor}
            fontSize="22"
            fontWeight="800"
            fontFamily="Outfit, sans-serif"
            letterSpacing="2"
          >
            {airline.name.toUpperCase()}
          </text>
        </g>

        {/* --- 4. Cockpit Windows & Passenger Windows --- */}
        <g id="windows" fill="#0F172A">
          {/* Cockpit Glass */}
          <path d="M 60 95 C 48 90, 35 82, 30 75 C 38 72, 52 75, 62 82 Z" fill="#0A84FF" opacity="0.9" stroke="#0284C7" strokeWidth="1" />

          {/* Passenger Window Strip */}
          {Array.from({ length: 32 }).map((_, i) => (
            <rect
              key={i}
              x={100 + i * 16}
              y={72}
              width="6"
              height="8"
              rx="3"
              fill="#1E293B"
              opacity="0.8"
            />
          ))}
        </g>

        {/* --- 5. Main Wing & Flaps --- */}
        <g id="wing">
          {/* Main Low-Wing Body */}
          <path
            d="M 330 92 L 480 165 C 490 170, 500 170, 485 178 L 410 160 L 290 98 Z"
            fill="#CBD5E1"
            stroke="#94A3B8"
            strokeWidth="1.5"
          />
          {/* Winglet / Wing Tip in Airline Primary Color */}
          <path
            d="M 480 165 L 498 185 L 485 188 L 472 170 Z"
            fill={primaryColor}
          />
        </g>

        {/* --- 6. Turbofan Engines (Under-Wing) --- */}
        <g id="engines">
          {/* Primary Engine */}
          <rect x="360" y="128" width="85" height="34" rx="10" fill="url(#engineGlow)" stroke="#475569" strokeWidth="1.5" />
          <ellipse cx="362" cy="145" rx="6" ry="16" fill={secondaryColor} />
          {/* Engine Intake Fan spinner */}
          <circle cx="362" cy="145" r="4" fill="#94A3B8" />

          {/* Second Engine if Widebody */}
          {isLargeWidebody && (
            <>
              <rect x="430" y="148" width="75" height="28" rx="8" fill="url(#engineGlow)" stroke="#475569" strokeWidth="1.5" />
              <ellipse cx="432" cy="162" rx="5" ry="13" fill={secondaryColor} />
              <circle cx="432" cy="162" r="3" fill="#94A3B8" />
            </>
          )}
        </g>

        {/* --- 7. Horizontal Tail Stabilizer --- */}
        <path
          d="M 680 98 L 745 115 L 755 112 L 710 92 Z"
          fill="#94A3B8"
          stroke="#64748B"
        />
      </svg>
    </div>
  );
};
