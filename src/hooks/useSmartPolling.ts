import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setAircraftList, setApiSettings, setWeather, setLoading, setError } from '../store/flightSlice';
import { fetchLiveAircrafts } from '../services/apiClient';
import { fetchLocalWeather } from '../services/weatherService';
import { useSpatialWorker } from './useSpatialWorker';

export function useSmartPolling() {
  const dispatch = useDispatch();
  const { location, apiSettings, vipRules, aircraftList } = useSelector((state: RootState) => state.flight);
  const { calculateSpatial } = useSpatialWorker();
  const intervalRef = useRef<number | null>(null);

  // Check if any aircraft is within 30 km
  const hasAircraftWithin30km = aircraftList.some((ac) => ac.distanceKm <= 30 && ac.distanceKm > 0);
  const pollingInterval = hasAircraftWithin30km ? 10000 : 60000; // 10s if <30km, 60s otherwise

  const pollData = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      // 1. Fetch live or simulated aircrafts
      const rawAircrafts = await fetchLiveAircrafts(
        location,
        apiSettings,
        vipRules,
        () => {
          // Callback when auto-fallback is triggered
          dispatch(setApiSettings({ ...apiSettings, useFallback: true }));
        }
      );

      // 2. Perform Web Worker Haversine spatial calculations off main thread
      const spatialResults = await calculateSpatial(location, rawAircrafts);

      // 3. Merge spatial results back into aircraft list
      const spatialMap = new Map(spatialResults.map((res) => [res.icao24, res]));
      const updatedAircrafts = rawAircrafts.map((ac) => {
        const spatial = spatialMap.get(ac.icao24);
        return {
          ...ac,
          distanceKm: spatial ? spatial.distanceKm : ac.distanceKm,
          trend: spatial ? spatial.trend : ac.trend,
        };
      });

      // Sort by proximity: VIPs first, then closest aircraft
      updatedAircrafts.sort((a, b) => {
        if (a.isVip && !b.isVip) return -1;
        if (!a.isVip && b.isVip) return 1;
        return a.distanceKm - b.distanceKm;
      });

      dispatch(setAircraftList(updatedAircrafts));

      // 4. Fetch weather update
      const weatherData = await fetchLocalWeather(location.latitude, location.longitude);
      dispatch(setWeather(weatherData));
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to update flight radar'));
    }
  }, [location, apiSettings, vipRules, calculateSpatial, dispatch]);

  useEffect(() => {
    pollData(); // initial fetch

    intervalRef.current = window.setInterval(() => {
      pollData();
    }, pollingInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pollData, pollingInterval]);

  return { pollingInterval, hasAircraftWithin30km, refreshManual: pollData };
}
