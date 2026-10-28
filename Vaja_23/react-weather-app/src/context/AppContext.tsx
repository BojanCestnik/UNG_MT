import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { ExtendedForecastData, WeatherData } from '../api/types';
import { fetchExtendedForecastData, fetchWeatherData } from '../api/weather';
import { toLocalDateParts } from '../utils/dateUtils';
import { kelvinToCelcius, TempUnit } from '../utils/unitConversion';

type WeatherQuery = string | { lat: number; lng: number };

type AppState = {
  tempUnit: TempUnit;
  isLoading: boolean;
  isInitial: boolean;
  darkMode: boolean;
  weatherData: WeatherData;
  extendedWeatherData: ExtendedForecastData[];
  isError: boolean;
  errorMessage: string | null;
};

type AppContextValue = AppState & {
  changeTempUnit: () => void;
  fetchWeather: (query: WeatherQuery) => Promise<void>;
  toggleDarkMode: () => void;
};

type WeatherApiResponse = [
  Omit<WeatherData, 'weather'> & {
    cod: number | string;
    message?: string;
    weather: WeatherData['weather'][];
  },
  {
    cod: number | string;
    message?: string;
    city: {
      timezone: number; // offset from UTC in seconds
    };
    // One entry every 3 hours
    list: ForecastApiItem[];
  },
];

type ForecastApiItem = {
  dt: number; // UTC unix timestamp in seconds
  main: {
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    id: number;
    main: string;
  }>;
};

const FORECAST_DAYS = 5;

/**
 * Groups the 3-hour forecast entries into one entry per day (in the place's local time).
 * Today is skipped, like in the original 7-day forecast, so the list starts with tomorrow.
 */
const groupForecastByDay = (list: ForecastApiItem[], timezoneOffset: number): ExtendedForecastData[] => {
  const today = toLocalDateParts(Date.now() / 1000, timezoneOffset).dateKey;
  const days = new Map<string, { dayName: string; min: number; max: number; middayItem: ForecastApiItem; middayDistance: number }>();

  for (const item of list) {
    const { dateKey, hour, dayName } = toLocalDateParts(item.dt, timezoneOffset);
    if (dateKey === today) continue;

    // The entry closest to 12:00 decides the day's weather icon
    const distanceFromNoon = Math.abs(hour - 12);
    const day = days.get(dateKey);

    if (!day) {
      days.set(dateKey, {
        dayName,
        min: item.main.temp_min,
        max: item.main.temp_max,
        middayItem: item,
        middayDistance: distanceFromNoon,
      });
      continue;
    }

    day.min = Math.min(day.min, item.main.temp_min);
    day.max = Math.max(day.max, item.main.temp_max);
    if (distanceFromNoon < day.middayDistance) {
      day.middayItem = item;
      day.middayDistance = distanceFromNoon;
    }
  }

  return Array.from(days.values())
    .slice(0, FORECAST_DAYS)
    .map((day) => ({
      day: day.dayName,
      temp: {
        temp_max: kelvinToCelcius(day.max),
        temp_min: kelvinToCelcius(day.min),
      },
      weather: {
        id: day.middayItem.weather[0].id,
        main: day.middayItem.weather[0].main,
      },
    }));
};

type Action =
  | { type: 'change-temp-unit' }
  | { type: 'fetch-error'; payload: string }
  | { type: 'fetch-success'; payload: { weather: WeatherData; forecast: ExtendedForecastData[] } }
  | { type: 'set-loading'; payload: boolean }
  | { type: 'toggle-dark-mode'; payload: boolean };

const initialWeatherData: WeatherData = {
  main: {
    feels_like: 0,
    humidity: 0,
    pressure: 0,
    temp: 0,
    temp_max: 0,
    temp_min: 0,
  },
  name: '',
  sys: {
    country: '',
    sunrise: 0,
    sunset: 0,
  },
  weather: {
    id: 200,
    main: '',
    description: '',
    icon: '',
  },
  wind: {
    deg: 0,
    speed: 0,
  },
};

const getInitialDarkMode = () => {
  return window.localStorage.getItem('darkMode') === 'true';
};

const initialState: AppState = {
  tempUnit: TempUnit.CELCIUS,
  isLoading: false,
  isInitial: true,
  darkMode: getInitialDarkMode(),
  weatherData: initialWeatherData,
  extendedWeatherData: [],
  isError: false,
  errorMessage: null,
};

const transformWeatherData = (
  res: WeatherApiResponse
): {
  weather: WeatherData;
  forecast: ExtendedForecastData[];
} => {
  const weather = {
    ...res[0],
    weather: res[0].weather[0],
    main: {
      ...res[0].main,
      temp: kelvinToCelcius(res[0].main.temp),
      feels_like: kelvinToCelcius(res[0].main.feels_like),
      temp_max: kelvinToCelcius(res[0].main.temp_max),
      temp_min: kelvinToCelcius(res[0].main.temp_min),
    },
    wind: {
      ...res[0].wind,
      speed: Math.round(res[0].wind.speed * 3.6),
    },
  };

  const forecast = groupForecastByDay(res[1].list, res[1].city.timezone);

  return {
    weather,
    forecast,
  };
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'change-temp-unit':
      return {
        ...state,
        tempUnit: state.tempUnit === TempUnit.CELCIUS ? TempUnit.FAHRENHEIT : TempUnit.CELCIUS,
      };
    case 'fetch-error':
      return {
        ...state,
        isError: true,
        errorMessage: action.payload,
        isLoading: false,
      };
    case 'fetch-success':
      return {
        ...state,
        extendedWeatherData: action.payload.forecast,
        isError: false,
        errorMessage: null,
        isInitial: false,
        isLoading: false,
        weatherData: action.payload.weather,
      };
    case 'set-loading':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'toggle-dark-mode':
      return {
        ...state,
        darkMode: action.payload,
      };
    default:
      return state;
  }
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const changeTempUnit = useCallback(() => {
    dispatch({ type: 'change-temp-unit' });
  }, []);

  const toggleDarkMode = useCallback(() => {
    const darkMode = !state.darkMode;
    window.localStorage.setItem('darkMode', darkMode.toString());
    dispatch({ type: 'toggle-dark-mode', payload: darkMode });
  }, [state.darkMode]);

  const fetchWeather = useCallback(async (query: WeatherQuery) => {
    dispatch({ type: 'set-loading', payload: true });

    try {
      const res = (await Promise.all([fetchWeatherData(query), fetchExtendedForecastData(query)])) as WeatherApiResponse;

      // OpenWeatherMap returns `cod` as a number on success and often as a string on errors
      const errors: string[] = [];
      if (Number(res[0].cod) !== 200) {
        errors.push(`Current weather: ${res[0].cod} - ${res[0].message ?? 'Unknown error'}`);
      }
      if (Number(res[1].cod) !== 200) {
        errors.push(`Forecast: ${res[1].cod} - ${res[1].message ?? 'Unknown error'}`);
      }

      if (errors.length > 0) {
        console.error('Weather API error:', res);
        dispatch({ type: 'fetch-error', payload: errors.join(' | ') });
        return;
      }

      dispatch({
        type: 'fetch-success',
        payload: transformWeatherData(res),
      });
    } catch (error) {
      console.error('Weather request failed:', error);
      const message = error instanceof Error ? error.message : String(error);
      dispatch({ type: 'fetch-error', payload: `Request failed: ${message}` });
    }
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      changeTempUnit,
      fetchWeather,
      toggleDarkMode,
    }),
    [changeTempUnit, fetchWeather, state, toggleDarkMode]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }

  return context;
};
