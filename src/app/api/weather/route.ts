// This is a server route
import { NextResponse } from 'next/server';

export async function GET() {
  const cities = ['Manila', 'Cebu', 'Davao', 'Calamba', 'California', 'Saudi Arabia'];
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  const weatherData = await Promise.all(
    cities.map(async (city) => {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();

      return {
        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        feels_like: data.main.feels_like,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      };
    })
  );

  return NextResponse.json(weatherData);
}
