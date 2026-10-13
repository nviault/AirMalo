import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from './store';
import { setIsIdle } from './store/flightSlice';
import { HeaderZone } from './components/HeaderZone';
import { HeroZone } from './components/HeroZone';
import { DataPanelZone } from './components/DataPanelZone';
import { SettingsModal } from './components/SettingsModal';
import { IdleClockView } from './components/IdleClockView';
import { useSmartPolling } from './hooks/useSmartPolling';
import { useIdleTimer } from './hooks/useIdleTimer';

export function App() {
  const dispatch = useDispatch();
  const { isIdle, activeVipIcao24 } = useSelector((state: RootState) => state.flight);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize background smart polling and idle detection timer
  useSmartPolling();
  useIdleTimer();

  return (
    <div
      className={`h-screen w-screen bg-black overflow-hidden flex flex-col justify-between select-none relative ${
        activeVipIcao24 ? 'vip-active-border' : ''
      }`}
    >
      {/* 1. Header (15% Top Zone) */}
      <HeaderZone onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* 2. Hero Zone (50% Center Immersion Zone with SVG aircraft & flight glide) */}
      <HeroZone />

      {/* 3. Data Panel (35% Bottom Zone) */}
      <DataPanelZone />

      {/* Settings & VIP Management Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Idle Mode Desk Clock Overlay */}
      {isIdle && (
        <IdleClockView onDismiss={() => dispatch(setIsIdle(false))} />
      )}
    </div>
  );
}

export default App;
