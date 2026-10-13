import type { WeatherData } from '../types';

export async function fetchLocalWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Weather API error');
    }
    const data = await res.json();
    const cw = data.current_weather;
    const weatherCode = cw.weathercode;
    const temp = Math.round(cw.temperature);

    const { iconName, condition } = getWeatherInfo(weatherCode);

    return {
      temperature: temp,
      weatherCode,
      iconName,
      condition,
      updatedAt: Date.now(),
    };
  } catch (err) {
    console.warn('Failed to fetch Open-Meteo weather, using realistic fallback:', err);
    return {
      temperature: 19,
      weatherCode: 0,
      iconName: 'Sun',
      condition: 'Dégagé',
      updatedAt: Date.now(),
    };
  }
}

function getWeatherInfo(code: number): { iconName: string; condition: string } {
  switch (code) {
    case 0:
      return { iconName: 'Sun', condition: 'Ciel Dégagé' };
    case 1:
    case 2:
    case 3:
      return { iconName: 'CloudSun', condition: 'Partiellement Nuageux' };
    case 45:
    case 48:
      return { iconName: 'CloudFog', condition: 'Brouillard' };
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
      return { iconName: 'CloudRain', condition: 'Pluie' };
    case 71:
    case 73:
    case 75:
      return { iconName: 'CloudSnow', condition: 'Neige' };
    case 95:
    case 96:
    case 99:
      return { iconName: 'CloudLightning', condition: 'Orage' };
    default:
      return { iconName: 'Cloud', condition: 'Nuageux' };
  }
}
