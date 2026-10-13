import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Aircraft, ApiSettings, LocationConfig, VipRule, WeatherData } from '../types';
import {
  loadApiSettings,
  loadLocationConfig,
  loadVipRules,
  saveApiSettings,
  saveLocationConfig,
  saveVipRules,
} from '../utils/storage';

interface FlightState {
  aircraftList: Aircraft[];
  selectedIcao24: string | null;
  activeVipIcao24: string | null;
  apiSettings: ApiSettings;
  location: LocationConfig;
  vipRules: VipRule[];
  weather: WeatherData | null;
  lastFetchTimestamp: number | null;
  isLoading: boolean;
  error: string | null;
  isIdle: boolean;
  idleLastActive: number;
}

const initialState: FlightState = {
  aircraftList: [],
  selectedIcao24: null,
  activeVipIcao24: null,
  apiSettings: loadApiSettings(),
  location: loadLocationConfig(),
  vipRules: loadVipRules(),
  weather: null,
  lastFetchTimestamp: null,
  isLoading: false,
  error: null,
  isIdle: false,
  idleLastActive: Date.now(),
};

export const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    setAircraftList: (state, action: PayloadAction<Aircraft[]>) => {
      state.aircraftList = action.payload;
      state.lastFetchTimestamp = Date.now();
      state.isLoading = false;
      state.error = null;

      // Evaluate VIP exclusivity focus
      const vipAircraft = action.payload.find((a) => a.isVip);
      if (vipAircraft) {
        state.activeVipIcao24 = vipAircraft.icao24;
        state.selectedIcao24 = vipAircraft.icao24;
      } else {
        state.activeVipIcao24 = null;
        if (!state.selectedIcao24 || !action.payload.some((a) => a.icao24 === state.selectedIcao24)) {
          state.selectedIcao24 = action.payload.length > 0 ? action.payload[0].icao24 : null;
        }
      }

      if (action.payload.length > 0) {
        state.idleLastActive = Date.now();
        state.isIdle = false;
      }
    },
    setSelectedIcao24: (state, action: PayloadAction<string>) => {
      state.selectedIcao24 = action.payload;
      state.idleLastActive = Date.now();
      state.isIdle = false;
    },
    setApiSettings: (state, action: PayloadAction<ApiSettings>) => {
      state.apiSettings = action.payload;
      saveApiSettings(action.payload);
    },
    setLocation: (state, action: PayloadAction<LocationConfig>) => {
      state.location = action.payload;
      saveLocationConfig(action.payload);
    },
    setVipRules: (state, action: PayloadAction<VipRule[]>) => {
      state.vipRules = action.payload;
      saveVipRules(action.payload);
    },
    addVipRule: (state, action: PayloadAction<Omit<VipRule, 'id'>>) => {
      const newRule: VipRule = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.vipRules.push(newRule);
      saveVipRules(state.vipRules);
    },
    removeVipRule: (state, action: PayloadAction<string>) => {
      state.vipRules = state.vipRules.filter((r) => r.id !== action.payload);
      saveVipRules(state.vipRules);
    },
    toggleVipRule: (state, action: PayloadAction<string>) => {
      const rule = state.vipRules.find((r) => r.id === action.payload);
      if (rule) {
        rule.enabled = !rule.enabled;
        saveVipRules(state.vipRules);
      }
    },
    setWeather: (state, action: PayloadAction<WeatherData>) => {
      state.weather = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setIsIdle: (state, action: PayloadAction<boolean>) => {
      state.isIdle = action.payload;
    },
    updateIdleActivity: (state) => {
      state.idleLastActive = Date.now();
      if (state.isIdle) {
        state.isIdle = false;
      }
    },
  },
});

export const {
  setAircraftList,
  setSelectedIcao24,
  setApiSettings,
  setLocation,
  setVipRules,
  addVipRule,
  removeVipRule,
  toggleVipRule,
  setWeather,
  setLoading,
  setError,
  setIsIdle,
  updateIdleActivity,
} = flightSlice.actions;

export default flightSlice.reducer;
