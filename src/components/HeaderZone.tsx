import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import {
  Sun,
  CloudSun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Cloud,
  CloudFog,
  Settings as SettingsIcon,
  Plane,
  Clock,
  Radio,
} from 'lucide-react';

interface HeaderZoneProps {
  onOpenSettings: () => void;
}

export const HeaderZone: React.FC<HeaderZoneProps> = ({ onOpenSettings }) => {
  const { weather, aircraftList, selectedIcao24, location, apiSettings } = useSelector(
    (state: RootState) => state.flight
  );

  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Currently focused aircraft distance & trend
  const currentAircraft = aircraftList.find((ac) => ac.icao24 === selectedIcao24) || aircraftList[0];
  const otherCount = Math.max(0, aircraftList.length - 1);

  // Weather icon mapping
  const renderWeatherIcon = () => {
    if (!weather) return <Sun className="w-5 h-5 text-amber-400" />;
    switch (weather.iconName) {
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-400" />;
      case 'CloudSun':
        return <CloudSun className="w-5 h-5 text-amber-300" />;
      case 'CloudRain':
        return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'CloudSnow':
        return <CloudSnow className="w-5 h-5 text-indigo-200" />;
      case 'CloudLightning':
        return <CloudLightning className="w-5 h-5 text-yellow-500" />;
      case 'CloudFog':
        return <CloudFog className="w-5 h-5 text-gray-400" />;
      default:
        return <Cloud className="w-5 h-5 text-gray-300" />;
    }
  };

  return (
    <header className="h-[15%] w-full px-6 py-3 glass-panel flex items-center justify-between border-b border-white/10 select-none">
      {/* Left: Clock & Weather */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-white">
          <Clock className="w-5 h-5 text-[#0A84FF]" />
          <span className="font-mono-telemetry text-2xl font-bold tracking-tight">{timeStr}</span>
        </div>

        <div className="h-6 w-[1px] bg-white/20" />

        <div className="flex items-center space-x-2.5 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
          {renderWeatherIcon()}
          <span className="font-mono-telemetry text-lg font-semibold text-[#F2F2F7]">
            {weather ? `${weather.temperature}°C` : '19°C'}
          </span>
          <span className="text-xs text-[#8E8E93] hidden md:inline">
            {weather?.condition || 'Dégagé'}
          </span>
        </div>
      </div>

      {/* Center: Distance & Proximity Indicator */}
      {currentAircraft ? (
        <div className="flex items-center space-x-3 bg-black/60 px-4 py-2 rounded-2xl border border-white/10">
          <Plane className="w-4 h-4 text-[#0A84FF] transform -rotate-45" />
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xs text-[#8E8E93] uppercase font-semibold">Distance :</span>
            <span className="font-mono-telemetry text-xl font-bold text-white">
              {currentAircraft.distanceKm} km
            </span>
            <span className="text-xl font-bold text-[#0A84FF]">
              {currentAircraft.trend === 'approaching' ? '↘' : currentAircraft.trend === 'receding' ? '↗' : '➔'}
            </span>
          </div>

          {otherCount > 0 && (
            <span className="ml-2 text-xs font-semibold px-2.5 py-1 bg-[#0A84FF]/20 text-[#0A84FF] rounded-full border border-[#0A84FF]/30">
              +{otherCount} autre{otherCount > 1 ? 's' : ''} vol{otherCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center space-x-2 text-[#8E8E93] text-sm font-medium">
          <Radio className="w-4 h-4 animate-pulse text-[#0A84FF]" />
          <span>Balayage du ciel en cours ({location.addressName})...</span>
        </div>
      )}

      {/* Right: Mode Badge & Settings Button */}
      <div className="flex items-center space-x-4">
        {apiSettings.demoMode && (
          <span className="text-xs uppercase tracking-wider font-bold px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-md border border-amber-500/30">
            Mode Démo
          </span>
        )}

        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-colors text-white"
          title="Paramètres API & VIP"
        >
          <SettingsIcon className="w-5 h-5 text-[#F2F2F7]" />
        </button>
      </div>
    </header>
  );
};
