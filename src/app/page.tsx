'use client';

import dynamic from 'next/dynamic';
import { useState, useContext, useEffect } from 'react';
import TopBar from './components/topbar';
import Dashboard from './components/dashboard';
import { themecontext } from "./themecontext";
import Footer from './components/footer';

const WeatherMap = dynamic(() => import('./components/WeatherMap'), {
  ssr: false,
});

export default function Home() {
  type ForecastItem = {
    date: string;
    avgTemp: string;
    rainProb: string;
  };
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme } = useContext(themecontext);
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const [forecast, setForecast] = useState<ForecastItem[]>([]);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      const data = await res.json();

      const transformedWeather = {
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        feels_like: data.main.feels_like,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
      };

      setWeather(transformedWeather);
    } catch (err) {
      console.error('Weather fetch failed:', err);
      setError('Failed to fetch weather data.');
    }
  };

  // 🌤️ Fetch weather based on lat/lon
  const fetchWeather2 = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      const data = await res.json();

      const dailyData = data.list.reduce((acc: any, item: any) => {
        const date = item.dt_txt.split(" ")[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
      }, {});


      const summary = Object.entries(dailyData).slice(0, 5).map(([date, entries]: any) => {
        const temps = entries.map((entry: any) => entry.main.temp);
        const rainChances = entries.map((entry: any) => entry.pop ?? 0); // Probability of Precipitation (0–1)

        return {
          date,
          avgTemp: (temps.reduce((a: number, b: number) => a + b, 0) / temps.length).toFixed(1),
          rainProb: (Math.max(...rainChances) * 100).toFixed(0), // convert to %
        };
      });

      setForecast(summary); // <== you must declare: const [forecast, setForecast] = useState([])
    } catch (err) {
      console.error('Forecast fetch failed:', err);
      setError('Failed to fetch forecast.');
    }
  };
  type CitySuggestion = {
    name: string;
    state?: string;
    country: string;
    lat: number;
    lon: number;
  };

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`);
      const data = await res.json();
      setSuggestions(data); // array of matching cities
    }
  };

  // 📍 Get location on first load
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
          fetchWeather2(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setError('Location permission denied.');
        }
      );
    } else {
      setError('Geolocation not supported by this browser.');
    }
  }, []);

  // 🌓 Theme toggler
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <>
      {weather ? (
        <div className='h-screen flex flex-col justify-between'>
        <div
          className="w-screen flex flex-col  gap-4 p-3 transition-colors"
          data-theme={theme || 'light'}
        >
          <div className="flex justify-center">
            <TopBar onSearchCurrent={fetchWeather} onSearchForecast={fetchWeather2} />
          </div>

          <div className="flex justify-center">
            <Dashboard weather={weather} forecast={forecast} />
          </div>
        </div>

        
        <Footer/>
        </div>
      ) : (
        <div
          className="h-screen w-screen flex flex-col justify-center gap-4 p-3 transition-colors"
          data-theme={theme || 'light'}
        >
          <div className="text-center text-[#5c4928] space-y-1">
            <div className='flex items-center gap-x-3 flex-col'>
              <img src="cloudy.png" alt="" className='h-25 w-25' />
              <h1 className='font-extrabold text-black font-sans text-5xl '>B<span className="text-[#7a6034]">RAIN</span>Y</h1>
            </div>
            <p className='text-[#5c4928] text-md'>Check the weather and rain probability.</p>
          </div>
          <div className='relative flex justify-center'>
             <input className='w-full md:w-1/3  bg-[#cfbfa3] rounded-full p-2 shadow-md text-black text-center' placeholder='Search city, address, country....' value={query}
            onChange={handleSearch} />
            <ul className="bg-[#e7dbc6] text-sm font-sans md:w-1/3  text-black rounded mt-4 shadow-md absolute top-full left-0 w-full text-center  left-1/2 transform -translate-x-1/2 ">
              {suggestions.map((city, i) => (
                <li
                  key={i}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    fetchWeather(city.lat, city.lon);
                    fetchWeather2(city.lat, city.lon);
                    setQuery(city.name);
                    setSuggestions([]);
                  }}
                >
                  {city.name}, {city.state ?? ''} {city.country}
                </li>
              ))}
            </ul></div>

          <div className="flex justify-center">
           
            <footer className="text-center py-4 text-xs  text-[#5c4928]">
                © {new Date().getFullYear()} All rights reserved.
               <p className='text-[#5c4928] text-xs '>Made by Joash </p>
            </footer>

          </div>
        </div>
      )}
    </>
  );

}
