// App.js

import React from "react";
import { Routes, Route } from "react-router-dom";
import CityTable from "../src/Components/CityTable";
import WeatherPage from "./Pages/WeatherPage";
import FavoriteLocations from "./Components/FavoriteLocations";
import WeatherForCurrentLocation from "./Components/WeatherForCurrentLocation";
// import WeatherPage from "./WeatherPage";

const App = () => {
  return (
    <>
    <Routes>
       <Route exact path="/" element={<CityTable />} />
       <Route exact path="/weather/:cityName" element={<WeatherPage />} />
       <Route exact path="favorites" element={<FavoriteLocations />} />
       <Route exact path="/currentlocation" element={<WeatherForCurrentLocation/>} />
      {/* <Route path="/weather/:cityName">
        <WeatherPage />
      </Route> */}
    </Routes>
    
    </>
  );
};

export default App;
