import type { Aircraft, ApiSettings, LocationConfig, VipRule } from '../types';
import { AIRLINES_MAP, DEFAULT_AIRLINE, AIRCRAFT_MODELS, SAMPLE_ROUTES } from './airlinesData';

// Helper to determine if an aircraft matches any enabled VIP rules
export function checkIsVip(
  model: string,
  airlineCode: string,
  registration: string,
  vipRules: VipRule[]
): { isVip: boolean; reason?: string } {
  for (const rule of vipRules) {
    if (!rule.enabled) continue;
    const ruleVal = rule.value.trim().toUpperCase();
    if (rule.type === 'model' && model.toUpperCase() === ruleVal) {
      return { isVip: true, reason: `Modèle VIP: ${rule.value}` };
    }
    if (rule.type === 'airline' && airlineCode.toUpperCase() === ruleVal) {
      return { isVip: true, reason: `Compagnie VIP: ${rule.value}` };
    }
    if (rule.type === 'registration' && registration.toUpperCase() === ruleVal) {
      return { isVip: true, reason: `Immatriculation VIP: ${rule.value}` };
    }
  }
  return { isVip: false };
}

// Generate realistic simulated mock aircrafts near observer
export function generateMockAircrafts(
  observer: LocationConfig,
  vipRules: VipRule[]
): Aircraft[] {
  const baseLat = observer.latitude;
  const baseLon = observer.longitude;

  const mockConfigs = [
    {
      icao24: 'a38801',
      callsign: 'UAE042',
      airlineCode: 'UAE',
      registration: 'A6-EUE',
      model: 'A388',
      routeIdx: 1,
      latOffset: 0.08,
      lonOffset: 0.12,
      altitudeFt: 38000,
      speedKmh: 910,
    },
    {
      icao24: 'a32002',
      callsign: 'AFR1824',
      airlineCode: 'AFR',
      registration: 'F-HBMO',
      model: 'A320',
      routeIdx: 6,
      latOffset: -0.05,
      lonOffset: 0.06,
      altitudeFt: 14500,
      speedKmh: 650,
    },
    {
      icao24: 'b77703',
      callsign: 'DLH401',
      airlineCode: 'DLH',
      registration: 'D-ABYA',
      model: 'B777',
      routeIdx: 3,
      latOffset: 0.18,
      lonOffset: -0.15,
      altitudeFt: 35000,
      speedKmh: 880,
    },
    {
      icao24: 'b78904',
      callsign: 'BAW117',
      airlineCode: 'BAW',
      registration: 'G-ZBJA',
      model: 'B789',
      routeIdx: 2,
      latOffset: -0.22,
      lonOffset: -0.20,
      altitudeFt: 39000,
      speedKmh: 930,
    },
  ];

  const now = Date.now();
  // Time-based small movement simulation
  const timeShift = (now / 10000) % 100;

  return mockConfigs.map((cfg, idx) => {
    const lat = baseLat + cfg.latOffset + (timeShift * 0.001 * (idx % 2 === 0 ? 1 : -1));
    const lon = baseLon + cfg.lonOffset + (timeShift * 0.001 * (idx % 2 === 0 ? -1 : 1));

    const airline = AIRLINES_MAP[cfg.airlineCode] || DEFAULT_AIRLINE;
    const route = SAMPLE_ROUTES[cfg.routeIdx] || SAMPLE_ROUTES[0];
    const vipCheck = checkIsVip(cfg.model, cfg.airlineCode, cfg.registration, vipRules);

    return {
      icao24: cfg.icao24,
      callsign: cfg.callsign,
      originCountry: airline.name,
      longitude: lon,
      latitude: lat,
      baroAltitude: cfg.altitudeFt / 3.28084,
      baroAltitudeFt: cfg.altitudeFt,
      geoAltitudeFt: cfg.altitudeFt,
      velocityKmh: cfg.speedKmh,
      trueTrack: 240,
      verticalRate: 0,
      squawk: '7000',
      onGround: false,
      distanceKm: 0, // Calculated by Web Worker
      trend: 'approaching',
      aircraftModel: cfg.model,
      registration: cfg.registration,
      airlineCode: cfg.airlineCode,
      airlineName: airline.name,
      originAirport: route.origin,
      destinationAirport: route.destination,
      isVip: vipCheck.isVip,
      vipReason: vipCheck.reason,
    };
  });
}

// OpenSky Network API Fetcher with Auto-Fallback Interceptor
export async function fetchLiveAircrafts(
  observer: LocationConfig,
  apiSettings: ApiSettings,
  vipRules: VipRule[],
  onFallbackTriggered?: () => void
): Promise<Aircraft[]> {
  if (apiSettings.demoMode) {
    return generateMockAircrafts(observer, vipRules);
  }

  // Calculate bounding box around observer (~100km radius ~ 1 degree lat/lon)
  const delta = 1.0;
  const lamin = observer.latitude - delta;
  const lamax = observer.latitude + delta;
  const lomin = observer.longitude - delta;
  const lomax = observer.longitude + delta;

  const activeKey = apiSettings.useFallback ? apiSettings.fallbackKey : apiSettings.primaryKey;
  const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lamax=${lamax}&lomin=${lomin}&lomax=${lomax}`;

  const headers: Record<string, string> = {};
  if (activeKey) {
    headers['Authorization'] = `Basic ${btoa(activeKey)}`;
  }

  try {
    const response = await fetch(url, { headers });

    if (response.status === 429 || response.status === 401) {
      console.warn(`OpenSky API returned HTTP ${response.status}. Interceptor triggering auto-fallback.`);
      if (!apiSettings.useFallback && apiSettings.fallbackKey) {
        if (onFallbackTriggered) onFallbackTriggered();
        // Retry once with fallback key
        return fetchLiveAircrafts(
          observer,
          { ...apiSettings, useFallback: true },
          vipRules
        );
      } else {
        console.warn('Fallback key not available or failed. Falling back to Demo Mode data.');
        return generateMockAircrafts(observer, vipRules);
      }
    }

    if (!response.ok) {
      throw new Error(`OpenSky API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data || !data.states) {
      return [];
    }

    // Map OpenSky state vectors to Aircraft objects
    return data.states.map((state: any[], index: number) => {
      const icao24 = state[0] || `unk_${index}`;
      const callsign = (state[1] || '').trim() || 'N/A';
      const originCountry = state[2] || 'Unknown';
      const lon = state[5];
      const lat = state[6];
      const baroMeters = state[7] || 0;
      const velocityMs = state[9] || 0;
      const trueTrack = state[10] || 0;
      const vertRate = state[11] || 0;
      const squawk = state[14] || null;
      const onGround = Boolean(state[8]);

      const baroAltitudeFt = Math.round(baroMeters * 3.28084);
      const velocityKmh = Math.round(velocityMs * 3.6);

      // Infer airline from callsign prefix (3 letters)
      const callsignPrefix = callsign.substring(0, 3).toUpperCase();
      const airline = AIRLINES_MAP[callsignPrefix] || DEFAULT_AIRLINE;
      const airlineCode = AIRLINES_MAP[callsignPrefix] ? callsignPrefix : 'GEN';

      // Infer model & registration if possible or select based on callsign hash
      const model = AIRCRAFT_MODELS[index % AIRCRAFT_MODELS.length];
      const registration = `N-${icao24.substring(0, 4).toUpperCase()}`;
      const route = SAMPLE_ROUTES[index % SAMPLE_ROUTES.length];

      const vipCheck = checkIsVip(model, airlineCode, registration, vipRules);

      return {
        icao24,
        callsign,
        originCountry,
        longitude: lon,
        latitude: lat,
        baroAltitude: baroMeters,
        baroAltitudeFt,
        geoAltitudeFt: baroAltitudeFt,
        velocityKmh,
        trueTrack,
        verticalRate: vertRate,
        squawk,
        onGround,
        distanceKm: 0,
        trend: 'stable' as const,
        aircraftModel: model,
        registration,
        airlineCode,
        airlineName: airline.name,
        originAirport: route.origin,
        destinationAirport: route.destination,
        isVip: vipCheck.isVip,
        vipReason: vipCheck.reason,
      };
    });
  } catch (err) {
    console.error('Fetch live aircrafts failed, returning mock data:', err);
    return generateMockAircrafts(observer, vipRules);
  }
}
