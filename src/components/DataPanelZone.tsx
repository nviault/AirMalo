import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { AIRLINES_MAP, DEFAULT_AIRLINE } from '../services/airlinesData';
import { ShieldCheck } from 'lucide-react';

export const DataPanelZone: React.FC = () => {
  const { aircraftList, selectedIcao24 } = useSelector((state: RootState) => state.flight);
  const currentAircraft = aircraftList.find((ac) => ac.icao24 === selectedIcao24) || aircraftList[0];

  if (!currentAircraft) {
    return (
      <footer className="h-[35%] w-full glass-panel px-8 py-6 flex items-center justify-center border-t border-white/10 text-[#8E8E93]">
        <p className="text-base font-medium">Attente d'un signal ADS-B...</p>
      </footer>
    );
  }

  const airline = AIRLINES_MAP[currentAircraft.airlineCode] || DEFAULT_AIRLINE;

  return (
    <footer className="h-[35%] w-full glass-panel px-8 py-4 flex flex-col justify-between border-t border-white/10 select-none relative z-10">
      {/* Line 1: Airline Logo + Airline Name */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 p-1 flex items-center justify-center border border-white/15 overflow-hidden">
            <img
              src={airline.logoUrl}
              alt={airline.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback icon if logo fails to load from CDN
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <span className="text-xs uppercase font-semibold text-[#8E8E93] tracking-wider block">
              Compagnie Aérienne
            </span>
            <span className="text-lg font-bold text-[#F2F2F7] font-sans-ui">
              {currentAircraft.airlineName}
            </span>
          </div>
        </div>

        {/* Squawk & Call Sign Badge */}
        <div className="flex items-center space-x-4">
          {currentAircraft.isVip && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#FF9F0A]/20 border border-[#FF9F0A]/40 text-[#FF9F0A] text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>AVION VIP</span>
            </div>
          )}
          <div className="text-right">
            <span className="text-xs uppercase font-semibold text-[#8E8E93] block">Squawk</span>
            <span className="font-mono-telemetry text-sm font-semibold text-white">
              {currentAircraft.squawk || '7000'}
            </span>
          </div>
        </div>
      </div>

      {/* Line 2 (Very Large): Flight Number + Airport Codes (Origin ➔ Destination) */}
      <div className="flex items-center justify-between py-1">
        <div className="flex items-baseline space-x-3">
          <span className="text-xs uppercase font-semibold text-[#8E8E93] tracking-widest">N° VOL :</span>
          <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0A84FF] font-mono-telemetry">
            {currentAircraft.callsign}
          </span>
        </div>

        {/* Airport Codes Route */}
        <div className="flex items-center space-x-3 bg-black/50 px-5 py-2 rounded-2xl border border-white/10">
          <span className="text-2xl md:text-3xl font-black font-mono-telemetry text-white tracking-wider">
            {currentAircraft.originAirport}
          </span>
          <span className="text-[#0A84FF] text-xl font-bold">➔</span>
          <span className="text-2xl md:text-3xl font-black font-mono-telemetry text-[#F2F2F7] tracking-wider">
            {currentAircraft.destinationAirport}
          </span>
        </div>
      </div>

      {/* Line 3 (Monospace Fixed-width Telemetry): Aircraft Model | Altitude in Ft | Speed in km/h */}
      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/10 font-mono-telemetry">
        <div className="bg-black/40 px-4 py-2 rounded-xl border border-white/5 flex flex-col justify-center">
          <span className="text-[11px] uppercase font-semibold text-[#8E8E93]">Modèle & Immat.</span>
          <span className="text-lg font-bold text-white tracking-tight truncate">
            {currentAircraft.aircraftModel} <span className="text-[#8E8E93] text-sm">({currentAircraft.registration})</span>
          </span>
        </div>

        <div className="bg-black/40 px-4 py-2 rounded-xl border border-white/5 flex flex-col justify-center">
          <span className="text-[11px] uppercase font-semibold text-[#8E8E93]">Altitude</span>
          <span className="text-lg font-bold text-emerald-400 tracking-tight">
            {currentAircraft.baroAltitudeFt.toLocaleString('fr-FR')} <span className="text-xs text-emerald-400/70">ft</span>
          </span>
        </div>

        <div className="bg-black/40 px-4 py-2 rounded-xl border border-white/5 flex flex-col justify-center">
          <span className="text-[11px] uppercase font-semibold text-[#8E8E93]">Vitesse Sol</span>
          <span className="text-lg font-bold text-cyan-400 tracking-tight">
            {currentAircraft.velocityKmh} <span className="text-xs text-cyan-400/70">km/h</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
