import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setIsIdle, updateIdleActivity } from '../store/flightSlice';

export function useIdleTimer() {
  const dispatch = useDispatch();
  const { isIdle, aircraftList, idleLastActive } = useSelector(
    (state: RootState) => state.flight
  );

  useEffect(() => {
    const handleUserActivity = () => {
      dispatch(updateIdleActivity());
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    // Check every 10s if sky has been empty for > 2 minutes
    const checkTimer = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActive = now - idleLastActive;

      // Empty sky or no user interaction for > 2 minutes (120 000 ms)
      if (aircraftList.length === 0 && timeSinceLastActive >= 120000 && !isIdle) {
        dispatch(setIsIdle(true));
      }
    }, 10000);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      clearInterval(checkTimer);
    };
  }, [aircraftList.length, idleLastActive, isIdle, dispatch]);

  return { isIdle };
}
