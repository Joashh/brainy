import { useState, useEffect } from "react";
import { FaLocationArrow } from "react-icons/fa";
import { IoIosPartlySunny } from "react-icons/io";
import { IoWaterSharp } from "react-icons/io5";
type WeatherData = {
    city: string;
    country: string;
    temperature: number;
    description: string;
    icon: string;
    feels_like: string;
    temp_min: number;
    temp_max: number;
};

type ForecastItem = {
    date: string;
    avgTemp: string;
    rainProb: string;
};

type Props = {
    weather: any; // You can replace `any` with an accurate weather type if desired
    forecast: ForecastItem[];
};


export default function Dashboard({ weather, forecast }: Props) {

    const today = new Date();

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const weekday = today.toLocaleDateString('en-US', { weekday: 'long' });
    const date = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const temp = Math.ceil(weather?.temperature);

    return (

        <div className="  dark:bg-[#4E6813] rounded-lg p-4 flex flex-col gap-5 w-full h-full md:w-1/2 md:justify-center ">

            <div className="rounded-full bg-[#9d7c44]  p-2 flex justify-center items-center gap-x-2 shadow-md">
                <FaLocationArrow className="text-white" />
                <h1 className="text-white font-sans text-md md:text-xl">{weather?.city}, {weather?.country}</h1>
            </div>

            <div className="bg-[#C8AD7F] p-5 rounded-lg flex flex-col justify-between ">
                <div className="flex flex-col  gap-10">
                    <div className="flex flex-col  w-full  ">
                        <h1 className="text-[#5c4928] text-4xl font-bold font-sans text-center">{weekday}</h1>
                        <p className="text-[#5c4928] font-sans text-center">{date} </p>
                    </div>

                    <h1 className="text-[#725d38] text-7xl font-extrabold font-sans text-center ">{temp}°C</h1>
                    <div className="flex flex-col">
                        
                            
                        
                        
                        <h1 className="text-[#75603b] text-center font-medium font-sans"> <span className="font-bold">High: </span >{weather?.temp_max} <span className="font-bold">Low:</span> {weather?.temp_min}</h1>
                        <h1 className="text-[#75603b] font-sans text-xs  text-center">{weather?.description}, feels like {weather?.feels_like}</h1>

                    </div>
                </div>
            </div>

            
                <div className="flex flex-col text-center bg-[#856d45] p-2 rounded-md">
                    <h1 className="text-white font-sans font-bold">PRECIPITATION PROBABILITY</h1>
                    
                    <div className="flex gap-5 justify-center p-3 ">
                        {forecast.map((item, index) => (
                            <div key={index} className="flex flex-col">
                                <IoWaterSharp className="text-white h-7 w-7 self-center" />
                                <h1 className="text-white text-md text-center font-sans ">  {
                                    new Date(item.date).toLocaleDateString(undefined, {
                                        weekday: 'short',
                                    })
                                } </h1>

                                <h1 className="text-white font-bold font-sans text-center">{item.rainProb}%</h1>
                            </div>
                        ))}

                    </div>
                </div>

        </div>
    );
}