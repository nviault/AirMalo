import type { ApiSettings, LocationConfig, VipRule } from '../types';

const STORAGE_KEYS = {
  API_SETTINGS: 'airmalo_api_settings',
  LOCATION: 'airmalo_location',
  VIP_RULES: 'airmalo_vip_rules',
  PREFERENCES: 'airmalo_preferences',
};

export const defaultApiSettings: ApiSettings = {
  primaryKey: '',
  fallbackKey: '',
  useFallback: false,
  demoMode: true, // default to demo mode so user sees instant live aircraft simulation
};

export const defaultLocation: LocationConfig = {
  latitude: 48.8566, // Paris default
  longitude: 2.3522,
  addressName: 'Paris, France',
  useGps: true,
};

export const defaultVipRules: VipRule[] = [
  { id: '1', type: 'model', value: 'A388', label: 'Airbus A380-800', enabled: true },
  { id: '2', type: 'airline', value: 'UAE', label: 'Emirates', enabled: true },
  { id: '3', type: 'registration', value: 'F-HBMO', label: 'F-HBMO Aircraft', enabled: true },
];

export function loadApiSettings(): ApiSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.API_SETTINGS);
    return data ? { ...defaultApiSettings, ...JSON.parse(data) } : defaultApiSettings;
  } catch {
    return defaultApiSettings;
  }
}

export function saveApiSettings(settings: ApiSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.API_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save API settings', err);
  }
}

export function loadLocationConfig(): LocationConfig {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOCATION);
    return data ? { ...defaultLocation, ...JSON.parse(data) } : defaultLocation;
  } catch {
    return defaultLocation;
  }
}

export function saveLocationConfig(location: LocationConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(location));
  } catch (err) {
    console.error('Failed to save location', err);
  }
}

export function loadVipRules(): VipRule[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.VIP_RULES);
    return data ? JSON.parse(data) : defaultVipRules;
  } catch {
    return defaultVipRules;
  }
}

export function saveVipRules(rules: VipRule[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.VIP_RULES, JSON.stringify(rules));
  } catch (err) {
    console.error('Failed to save VIP rules', err);
  }
}
