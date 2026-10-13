import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setSelectedIcao24 } from '../store/flightSlice';
import { AircraftSvgCompositor } from './AircraftSvgCompositor';
import { ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react';

export const HeroZone: React.FC = () => {
  const dispatch = useDispatch();
  const { aircraftList, selectedIcao24, activeVipIcao24 } = useSelector(
    (state: RootState) => state.flight
  );

  const selectedIndex = aircraftList.findIndex((ac) => ac.icao24 === selectedIcao24);
  const currentAircraft = aircraftList[selectedIndex >= 0 ? selectedIndex : 0];

  // Auto carousel rotation every 8 seconds if no VIP is locking exclusive focus
  useEffect(() => {
    if (activeVipIcao24 || aircraftList.length <= 1) return;

    const timer = setInterval(() => {
      const nextIdx = (selectedIndex + 1) % aircraftList.length;
      dispatch(setSelectedIcao24(aircraftList[nextIdx].icao24));
    }, 8000);

    return () => clearInterval(timer);
  }, [aircraftList, selectedIndex, activeVipIcao24, dispatch]);

  const handlePrev = () => {
    if (aircraftList.length === 0) return;
    const prevIdx = (selectedIndex - 1 + aircraftList.length) % aircraftList.length;
    dispatch(setSelectedIcao24(aircraftList[prevIdx].icao24));
  };

  const handleNext = () => {
    if (aircraftList.length === 0) return;
    const nextIdx = (selectedIndex + 1) % aircraftList.length;
    dispatch(setSelectedIcao24(aircraftList[nextIdx].icao24));
  };

  if (!currentAircraft) {
    return (
      <main className="h-[50%] w-full flex flex-col items-center justify-center p-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,132,255,0.08),transparent_70%)]" />
        <p className="text-xl text-[#8E8E93] font-medium z-10">Aucun appareil en vol détecté à proximité</p>
        <span className="text-sm text-[#8E8E93]/60 mt-2 z-10">Transition automatique vers l'horloge dans 2 minutes</span>
      </main>
    );
  }

  return (
    <main className="h-[50%] w-full relative flex items-center justify-center bg-black overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,132,255,0.12),transparent_75%)] pointer-events-none" />

      {/* Carousel Left Navigation Button */}
      {aircraftList.length > 1 && !activeVipIcao24 && (
        <button
          onClick={handlePrev}
          className="absolute left-6 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white hover:bg-white/25 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Hero Aircraft SVG with slow gliding flight animation */}
      <div className="w-full max-w-5xl px-8 z-10 flex flex-col items-center justify-center">
        {/* VIP Alert Badge Overlay */}
        {currentAircraft.isVip && (
          <div className="mb-4 flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FF9F0A]/20 border border-[#FF9F0A]/50 text-[#FF9F0A] animate-pulse">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-xs uppercase font-bold tracking-widest">
              Focus Exclusif Radar VIP : {currentAircraft.vipReason}
            </span>
          </div>
        )}

        <div className="w-full animate-flight-slow">
          <AircraftSvgCompositor
            model={currentAircraft.aircraftModel}
            airlineCode={currentAircraft.airlineCode}
          />
        </div>
      </div>

      {/* Carousel Right Navigation Button */}
      {aircraftList.length > 1 && !activeVipIcao24 && (
        <button
          onClick={handleNext}
          className="absolute right-6 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white hover:bg-white/25 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Carousel Dots Indicators */}
      {aircraftList.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 z-20">
          {aircraftList.map((ac) => (
            <button
              key={ac.icao24}
              onClick={() => dispatch(setSelectedIcao24(ac.icao24))}
              className={`h-2 rounded-full transition-all duration-300 ${
                ac.icao24 === currentAircraft.icao24
                  ? ac.isVip
                    ? 'w-8 bg-[#FF9F0A]'
                    : 'w-8 bg-[#0A84FF]'
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </main>
  );
};
