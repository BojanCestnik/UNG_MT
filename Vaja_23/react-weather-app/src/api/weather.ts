const baseUrl = 'https://api.openweathermap.org/data/2.5';
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

export const fetchWeatherData = async (city: string | { lat: number; lng: number }) => {
  let url = `${baseUrl}/weather?q=${city}&appid=${apiKey}`;

  if (typeof city === 'object') {
    url = `${baseUrl}/weather?lat=${city.lat}&lon=${city.lng}&appid=${apiKey}`;
  }
  return await (await fetch(url)).json();
};

export const fetchExtendedForecastData = async (city: string | { lat: number; lng: number }) => {
  // Free plan endpoint: 5 days of forecast in 3-hour steps (40 entries)
  let url = `${baseUrl}/forecast?q=${city}&appid=${apiKey}`;

  if (typeof city === 'object') {
    url = `${baseUrl}/forecast?lat=${city.lat}&lon=${city.lng}&appid=${apiKey}`;
  }

  return await (await fetch(url)).json();
};
