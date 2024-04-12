import React from "react";
import { Routes, Route } from "react-router-dom";
import CityTable from "./Components/CityTable/CityTable";
import WeatherPage from "./Pages/WeatherPage/WeatherPage";
import FavoriteLocations from "./Components/FavoriteLocations/FavoriteLocations";
import WeatherForCurrentLocation from "./Components/WeatherForCurrentLocation/WeatherForCurrentLocation";

const App = () => {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<CityTable />} />
        <Route exact path="/weather/:cityName" element={<WeatherPage />} />
        <Route exact path="favorites" element={<FavoriteLocations />} />
        <Route
          exact
          path="/currentlocation"
          element={<WeatherForCurrentLocation />}
        />
      </Routes>
    </>
  );
};

export default App;
