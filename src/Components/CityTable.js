import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Autosuggest from "react-autosuggest";
import { useNavigate } from "react-router-dom"; 
import "./CityTable.css";

const CityTable = () => {
  const [cities, setCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const tableRef = useRef();
  const navigate = useNavigate();


  useEffect(() => {
    fetchData();
  }, [pageNumber]);

  useEffect(() => {
    filterCities();
  }, [searchQuery, cities]);

  useEffect(() => {
    // Load favorites from local storage on component mount
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    // Update local storage when favorites change
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100&refine=cou_name_en%3A%22India%22&offset=${
          (pageNumber - 1) * 100
        }`
      );
      setCities((prevCities) => [...prevCities, ...response.data.results]);
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    } catch (error) {
      console.error("Error fetching city data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterCities = () => {
    const filtered = cities.filter((city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  const handleSearchChange = (_, { newValue }) => {
    setSearchQuery(newValue);
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedCities = filteredCities.sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0
      ? []
      : cities.filter(
          (city) => city.name.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  const handleCityClick = (cityName) => {
    navigate(`/weather/${cityName}`); // Redirect to the weather page for the clicked city
  };

  const renderSuggestion = (suggestion) => (
    <div onClick={() => handleCityClick(suggestion.name)}>
      {suggestion.name}
    </div>
  );

  const inputProps = {
    placeholder: "Search city...",
    value: searchQuery,
    onChange: handleSearchChange,
  };

  const handleToggleFavorite = (city) => {
    if (favorites.some((fav) => fav.geoname_id === city.geoname_id)) {
      // Remove from favorites
      setFavorites(favorites.filter((fav) => fav.geoname_id !== city.geoname_id));
    } else {
      // Add to favorites
      setFavorites([...favorites, city]);
    }
  };

  const isFavorite = (city) => {
    return favorites.some((fav) => fav.geoname_id === city.geoname_id);
  };

  const handleScroll = () => {
    const bottom =
      tableRef.current.scrollHeight - tableRef.current.scrollTop ===
      tableRef.current.clientHeight;
    if (bottom && !loading) {
      fetchData();
    }
  };

  const handleViewFavorites = () => {
    navigate("/favorites"); // Redirect to the favorites page
  };
  const handleViewLocationWeather = () => {
    navigate("/currentlocation"); // Redirect to the favorites page
  };

  return (
    <div className="container" onScroll={handleScroll} ref={tableRef}>
      <h1>Cities Weather</h1>
      <Autosuggest
        suggestions={getSuggestions(searchQuery)}
        onSuggestionsFetchRequested={() => {}}
        onSuggestionsClearRequested={() => {}}
        getSuggestionValue={(suggestion) => suggestion.name}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
      <div>
        <button onClick={() => handleSort("name")}>
          Sort by Name{" "}
          {sortColumn === "name" && (sortDirection === "asc" ? "▲" : "▼")}
        </button>
        <button onClick={handleViewFavorites}>View Favorites</button> {/* Button to redirect to favorites */}
        <button onClick={handleViewLocationWeather} className="location">Get weather for current location</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>City Name</th>
            <th>Country</th>
            <th>Timezone</th>
            <th>Favorite</th>
          </tr>
        </thead>
        <tbody>
          {sortedCities.map((city) => (
            <tr key={city.geoname_id}>
              <td style={{ cursor: "pointer" }} onClick={() => handleCityClick(city.name)}>{city.name}</td>
              <td>{city.cou_name_en}</td>
              <td>{city.timezone}</td>
              <td>
                <button onClick={() => handleToggleFavorite(city)}>
                  {isFavorite(city) ? "Remove from Favorites" : "Add to Favorites"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <p className="loading">Loading...</p>}
    </div>
  );
};

export default CityTable;


