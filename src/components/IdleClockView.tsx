import React, { useState, useEffect } from 'react';
import { Plane } from 'lucide-react';

interface IdleClockViewProps {
  onDismiss: () => void;
}

export const IdleClockView: React.FC<IdleClockViewProps> = ({ onDismiss }) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  // Burn-in prevention random pixel shifts every 30 minutes
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDateStr(
        now.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };

    updateDateTime();
    const clockTimer = setInterval(updateDateTime, 1000);

    // Burn-in pixel shift every 30 minutes
    const shiftTimer = setInterval(() => {
      const randomX = Math.floor(Math.random() * 30) - 15; // -15px to +15px
      const randomY = Math.floor(Math.random() * 30) - 15;
      setOffset({ x: randomX, y: randomY });
    }, 30 * 60 * 1000);

    return () => {
      clearInterval(clockTimer);
      clearInterval(shiftTimer);
    };
  }, []);

  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center select-none cursor-pointer p-8 transition-transform duration-1000 ease-in-out"
    >
      <div
        className="flex flex-col items-center justify-center transition-all duration-1000"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        {/* Giant Monospace Desk Clock */}
        <h1 className="text-8xl md:text-[140px] font-black font-mono-telemetry tracking-tighter text-[#F2F2F7] drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]">
          {timeStr}
        </h1>

        {/* Date Display */}
        <p className="text-2xl md:text-3xl font-light text-[#8E8E93] capitalize mt-4 font-sans-ui">
          {dateStr}
        </p>

        {/* Discrete Brand Logo */}
        <div className="mt-16 flex items-center space-x-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 opacity-70">
          <Plane className="w-5 h-5 text-[#0A84FF] transform -rotate-45" />
          <span className="text-base font-semibold tracking-widest text-[#F2F2F7] uppercase font-sans-ui">
            AirMalo <span className="text-xs text-[#8E8E93] font-normal">| Radar VIP</span>
          </span>
        </div>

        <p className="text-xs text-[#8E8E93]/50 mt-8">
          Ciel calme • Touchez l'écran pour afficher le radar
        </p>
      </div>
    </div>
  );
};
