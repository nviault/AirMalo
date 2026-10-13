export interface AirlineInfo {
  code: string;
  name: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export const AIRLINES_MAP: Record<string, AirlineInfo> = {
  AFR: {
    code: 'AFR',
    name: 'Air France',
    logoUrl: 'https://logo.clearbit.com/airfrance.com',
    primaryColor: '#002157', // Deep Navy Blue
    secondaryColor: '#ED2939', // Red Tail Accent
    accentColor: '#FFFFFF',
  },
  UAE: {
    code: 'UAE',
    name: 'Emirates',
    logoUrl: 'https://logo.clearbit.com/emirates.com',
    primaryColor: '#D71921', // Red
    secondaryColor: '#007A3D', // Green Flag Accent
    accentColor: '#FFD700', // Gold
  },
  DLH: {
    code: 'DLH',
    name: 'Lufthansa',
    logoUrl: 'https://logo.clearbit.com/lufthansa.com',
    primaryColor: '#05164D', // Dark Blue
    secondaryColor: '#FFAB00', // Deep Yellow
    accentColor: '#FFFFFF',
  },
  BAW: {
    code: 'BAW',
    name: 'British Airways',
    logoUrl: 'https://logo.clearbit.com/britishairways.com',
    primaryColor: '#075AAA', // BA Blue
    secondaryColor: '#EB2226', // BA Red
    accentColor: '#FFFFFF',
  },
  AAL: {
    code: 'AAL',
    name: 'American Airlines',
    logoUrl: 'https://logo.clearbit.com/aa.com',
    primaryColor: '#0078D2',
    secondaryColor: '#C8102E',
    accentColor: '#A2AAAD',
  },
  SWR: {
    code: 'SWR',
    name: 'SWISS',
    logoUrl: 'https://logo.clearbit.com/swiss.com',
    primaryColor: '#E2001A',
    secondaryColor: '#FFFFFF',
    accentColor: '#000000',
  },
  SIA: {
    code: 'SIA',
    name: 'Singapore Airlines',
    logoUrl: 'https://logo.clearbit.com/singaporeair.com',
    primaryColor: '#102A45',
    secondaryColor: '#F5A623',
    accentColor: '#FFFFFF',
  },
  QTR: {
    code: 'QTR',
    name: 'Qatar Airways',
    logoUrl: 'https://logo.clearbit.com/qatarairways.com',
    primaryColor: '#5C0632', // Burgundy
    secondaryColor: '#FFFFFF',
    accentColor: '#808080',
  },
};

export const DEFAULT_AIRLINE: AirlineInfo = {
  code: 'GEN',
  name: 'Skyways International',
  logoUrl: 'https://logo.clearbit.com/flightradar24.com',
  primaryColor: '#0A84FF',
  secondaryColor: '#1C1C1E',
  accentColor: '#FFFFFF',
};

export const AIRCRAFT_MODELS = ['A388', 'A359', 'A320', 'B777', 'B789', 'A333', 'B738'];

export const SAMPLE_ROUTES = [
  { origin: 'CDG', destination: 'JFK', name: 'Paris ➔ New York' },
  { origin: 'DXB', destination: 'CDG', name: 'Dubai ➔ Paris' },
  { origin: 'LHR', destination: 'SIN', name: 'London ➔ Singapore' },
  { origin: 'FRA', destination: 'HND', name: 'Frankfurt ➔ Tokyo' },
  { origin: 'LAX', destination: 'SYD', name: 'Los Angeles ➔ Sydney' },
  { origin: 'AMS', destination: 'GRU', name: 'Amsterdam ➔ São Paulo' },
  { origin: 'ORY', destination: 'NCE', name: 'Paris ➔ Nice' },
];
