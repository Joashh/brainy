import { IoIosCloud } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { useState, useContext } from "react";
import Switch from "react-switch";
import { themecontext } from "../themecontext";

type CitySuggestion = {
    name: string;
    state?: string;
    country: string;
    lat: number;
    lon: number;
};
type Props = {
    onSearchCurrent: (lat: number, lon: number) => void;
    onSearchForecast: (lat: number, lon: number) => void;
};

export default function TopBar({ onSearchCurrent, onSearchForecast }: Props) {


    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);


    const { theme, setTheme } = useContext(themecontext);
    function toggleTheme() {
        if (!isChecked) {
            setTheme("dark");
            localStorage.setItem("theme", "dark");
            document.documentElement.classList.add("dark");
        }
        else {
            setTheme("light")
            localStorage.setItem("theme", "light");
            document.documentElement.classList.remove("dark");
        }
    }

    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = (checked: boolean) => {
        setIsChecked(checked);
        toggleTheme();
    };

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 2) {
            const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`);
            const data = await res.json();
            setSuggestions(data); // array of matching cities
        }
    };


    return (
        <div className=" gap-x-10 dark:bg-[#FFEDA8] rounded-lg p-4 flex justify-between w-full md:w-1/2">

            <div className="flex gap-x-3 items-center">

                <h1 className='font-bold text-black font-sans text-2xl md:text-5xl '>B<span className="text-[#7a6034]">RAIN</span>Y</h1>
            </div>

            {/* This is a <Switch onChange={handleToggle} checked={isChecked} uncheckedIcon checkedIcon  onColor="#4F46E5" />JSX comment */}



            <div className="flex flex-col  w-full rounded-full  gap-x-3">
                <div className="flex gap-x-2">
                    <FaSearch className="self-center text-black h-5 w-5" />
                    <input
                        className="relative w-full text-xs md:text-base bg-[#e7dbc6] rounded-full text-black p-2 px-4 border-[#13182c]"
                        placeholder="Search Location..."
                        value={query}
                        onChange={handleSearch}
                    />
                </div>


                <ul className="bg-[#e7dbc6] text-xs  text-black rounded mt-1 shadow-md absolute ">
                    {suggestions.map((city, i) => (
                        <li
                            key={i}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => {
                                onSearchCurrent(city.lat, city.lon);
                                onSearchForecast(city.lat, city.lon);
                                setQuery(city.name);
                                setSuggestions([]);
                            }}
                        >
                            {city.name}, {city.state ?? ''} {city.country}
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}