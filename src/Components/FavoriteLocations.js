import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FavoriteLocations.css";

const FavoriteLocations = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load favorites from local storage on component mount
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const handleRemoveFavorite = (cityId) => {
    // Remove city from favorites list
    const updatedFavorites = favorites.filter((city) => city.geoname_id !== cityId);
    setFavorites(updatedFavorites);
    // Update local storage
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleCityClick = (cityName) => {
    navigate(`/weather/${cityName}`); // Redirect to the weather page for the clicked city
  };

  return (
    <div className="favorite-locations-container">
      <h1>Favorite Locations</h1>
      {favorites.length === 0 ? (
        <p>No favorite locations added yet.</p>
      ) : (
        <ul>
          {favorites.map((city) => (
            <li className="favorite-location-item" key={city.geoname_id}>
              <span className="favorite-location-name" onClick={() => handleCityClick(city.name)}>
                {city.name}
              </span>
              <button className="remove-button" onClick={() => handleRemoveFavorite(city.geoname_id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoriteLocations;

