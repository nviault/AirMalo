// Web Worker for Haversine & Spatial Calculations

export interface SpatialCalculationInput {
  observer: {
    latitude: number;
    longitude: number;
  };
  aircrafts: Array<{
    icao24: string;
    latitude: number;
    longitude: number;
    previousDistanceKm?: number;
    [key: string]: any;
  }>;
}

export interface SpatialCalculationOutput {
  icao24: string;
  distanceKm: number;
  trend: 'approaching' | 'receding' | 'stable';
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 decimal place
}

self.onmessage = (e: MessageEvent<SpatialCalculationInput>) => {
  const { observer, aircrafts } = e.data;
  if (!observer || !aircrafts) return;

  const results: SpatialCalculationOutput[] = aircrafts.map((ac) => {
    const distanceKm = haversineDistance(
      observer.latitude,
      observer.longitude,
      ac.latitude,
      ac.longitude
    );

    let trend: 'approaching' | 'receding' | 'stable' = 'stable';
    if (ac.previousDistanceKm !== undefined && ac.previousDistanceKm !== null) {
      const diff = distanceKm - ac.previousDistanceKm;
      if (diff < -0.2) {
        trend = 'approaching';
      } else if (diff > 0.2) {
        trend = 'receding';
      }
    }

    return {
      icao24: ac.icao24,
      distanceKm,
      trend,
    };
  });

  self.postMessage(results);
};
