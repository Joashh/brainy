'use client';
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function WeatherMap() {
  const position: [number, number] = [14.5995, 120.9842]; // Manila
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  return (
    <MapContainer
      center={position}
      zoom={6}
      scrollWheelZoom={true}
      style={{ height: '500px', width: '100%' }}
      className='self-cente rounded-md'
    >
      <LayersControl position="topright">
        
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>

       
        <LayersControl.BaseLayer name="Satellite (ESRI)">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          />
        </LayersControl.BaseLayer>

       
        <LayersControl.Overlay name="Clouds Overlay" checked>
          <TileLayer
            url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
            attribution='&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
          />
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}
