export interface Aircraft {
  icao24: string;
  callsign: string;
  originCountry: string;
  longitude: number;
  latitude: number;
  baroAltitude: number | null; // feet or meters from source
  baroAltitudeFt: number; // in feet
  geoAltitudeFt: number;
  velocityKmh: number; // in km/h
  trueTrack: number; // degrees
  verticalRate: number; // m/s
  squawk: string | null;
  onGround: boolean;
  distanceKm: number; // computed from observer
  trend: 'approaching' | 'receding' | 'stable';
  aircraftModel: string;
  registration: string;
  airlineCode: string; // e.g., 'AFR', 'UAE', 'DLH'
  airlineName: string;
  originAirport: string;
  destinationAirport: string;
  isVip: boolean;
  vipReason?: string;
}

export interface VipRule {
  id: string;
  type: 'model' | 'airline' | 'registration';
  value: string; // e.g. "A388", "UAE", "F-HBMO"
  label: string;
  enabled: boolean;
}

export interface LocationConfig {
  latitude: number;
  longitude: number;
  addressName: string;
  useGps: boolean;
}

export interface ApiSettings {
  primaryKey: string;
  fallbackKey: string;
  useFallback: boolean;
  demoMode: boolean;
}

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  iconName: string;
  condition: string;
  updatedAt: number;
}
