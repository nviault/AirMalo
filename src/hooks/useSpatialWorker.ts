import { useEffect, useRef, useCallback } from 'react';
import type { Aircraft, LocationConfig } from '../types';

export function useSpatialWorker() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/spatialWorker.ts', import.meta.url),
      { type: 'module' }
    );

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const calculateSpatial = useCallback(
    (
      observer: LocationConfig,
      aircrafts: Aircraft[]
    ): Promise<Array<{ icao24: string; distanceKm: number; trend: 'approaching' | 'receding' | 'stable' }>> => {
      return new Promise((resolve) => {
        if (!workerRef.current) {
          // Fallback if worker isn't supported or initialized
          const R = 6371;
          const res = aircrafts.map((ac) => {
            const dLat = ((ac.latitude - observer.latitude) * Math.PI) / 180;
            const dLon = ((ac.longitude - observer.longitude) * Math.PI) / 180;
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos((observer.latitude * Math.PI) / 180) *
                Math.cos((ac.latitude * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distanceKm = Math.round(R * c * 10) / 10;
            return {
              icao24: ac.icao24,
              distanceKm,
              trend: ac.trend || ('stable' as const),
            };
          });
          resolve(res);
          return;
        }

        const handleMessage = (e: MessageEvent) => {
          workerRef.current?.removeEventListener('message', handleMessage);
          resolve(e.data);
        };

        workerRef.current.addEventListener('message', handleMessage);
        workerRef.current.postMessage({
          observer: {
            latitude: observer.latitude,
            longitude: observer.longitude,
          },
          aircrafts: aircrafts.map((ac) => ({
            icao24: ac.icao24,
            latitude: ac.latitude,
            longitude: ac.longitude,
            previousDistanceKm: ac.distanceKm,
          })),
        });
      });
    },
    []
  );

  return { calculateSpatial };
}
