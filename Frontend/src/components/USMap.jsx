import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../css/US.css';


const USMap = () => {
    const [geoData, setGeoData] = useState(null);
    const [clickedCountryName, setClickedCountryName] = useState(null);
    const [hoveredCountryName, setHoveredCountryName] = useState(null);
    const [categoryNumbers, setCategoryNumbers] = useState({
      All:  0,
      Armouredvehicles: 0,
      Artillery: 0,
      Aircraft: 0,
      Ships: 0,
      Navalweapons: 0,
      Airdefencesystems: 0,
      Missiles: 0,
      Sensors: 0,
      Engines: 0,
      Other: 0
    });
    const bounds = [
      [-85, -180], // Southwest corner of the world (latitude, longitude)
      [85, 180] // Northeast corner of the world (latitude, longitude)
    ];
    const [tradeData, setTradeData] = useState();

  const position = [51.505, -0.09]; // Example coordinates for the map center
  const countryStyle = {
    fillColor: '#3388ff',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
  };

  const highlightedStyle = {
    fillColor: '#ff7800',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
  };

  const hoverStyle = {
    fillColor: '#ffcc00',
    weight: 2,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.7
  };

  const style = (feature)  => {
    if(clickedCountryName === feature.properties.name_long){
      return highlightedStyle;
    }
    if(hoveredCountryName === feature.properties.name_long){
      return hoverStyle;
    }
    return countryStyle;
  };

    useEffect(() => {
        async function fetchGeoData() {
            try {
            const response = await fetch('http://localhost:3006/USA/');
            //console.log(response);  // Inspect the entire response object
            if(!response.ok) {
                console.error('Server error:', response.status, response.statusText);
                return;
            }
            const mapData = await response.json();
            setGeoData(mapData);
            } catch (error) {
            console.error('Error fetching the GeoJSON data', error);
          }
        }
        fetchGeoData();
    }, []);

  const handleCountryClick = async (country) => {
    async function fetchWeaponNumbers() {
      try {
        const response = await fetch('http://localhost:3006/USA/' + country);
        if(!response.ok){
          console.error('Server error', response.status, response.statusText);
          return;
        }
        const weaponData = await response.json();
        setCategoryNumbers({
          All:  0,
          Armouredvehicles: 0,
          Artillery: 0,
          Aircraft: 0,
          Ships: 0,
          Navalweapons: 0,
          Airdefencesystems: 0,
          Missiles: 0,
          Sensors: 0,
          Engines: 0,
          Other: 0
        })
        setTradeData();
        weaponData.forEach(weapon => {
          const categoryNum = Number(weapon.weapon_count);
            if(weapon.armament_category.split(" ").length > 1){
              var category = weapon.armament_category.replace(/\s+/g, "");
            }
            else{
              var category = weapon.armament_category;
            }
            setCategoryNumbers(prevState => ({
              ...prevState,
              All: prevState.All + categoryNum,
              [category]:  categoryNum// Update category
            }));

            
        })
        //console.log(categoryNumbers);
      } 
      catch (error){
        console.log('error fetching weapon numbers data', error)
      }
    }
    fetchWeaponNumbers(); 
  }

  const onEachCountry = (country, layer) => {
      layer.bindTooltip(country.properties.name_long, { permanent: false, direction: 'center', className: 'country-tooltip' });
      layer.on({
        click: () => {
          setClickedCountryName(country.properties.name_long);
          handleCountryClick(country.properties.name_long);
          handleUpdate('All', country.properties.name_long);
        },
        mouseover: () => {
          if(clickedCountryName !== country.properties.name_long){
            setHoveredCountryName(country.properties.name_long);
          }
        },
        mouseout: (e) => {
            setHoveredCountryName(null);
        }
      });
  };

    const handleUpdate = async (category, country) => {
      if(country != null){
        async function fetchTradeData(category) {
          try {
            let link = 'http://localhost:3006/USA/' + country + '/' + category;
            //console.log(link);
          const response = await fetch(link);

          if(!response.ok) {
              console.error('Server error:', response.status, response.statusText);
              return;
          }

          const trade = await response.json();
          setTradeData(trade);
          } catch (error) {
          console.error('Error fetching the trade register data', error);
        }
      }
      fetchTradeData(category);
      }
      else{
        alert("Please select a country");
      }
    };

  return (
    <div>
          <div className='button-container'>
              <button onClick={() => handleUpdate('All', clickedCountryName)}> All: {categoryNumbers.All} </button>
              <button onClick={() => handleUpdate('Armoured vehicles', clickedCountryName)}>Armoured vehicles: {categoryNumbers.Armouredvehicles}</button>
              <button onClick={() => handleUpdate('Artillery', clickedCountryName)}>Artillery: {categoryNumbers.Artillery}</button>
              <button onClick={() => handleUpdate('Aircraft', clickedCountryName)}>Aircraft: {categoryNumbers.Aircraft}</button>
              <button onClick={() => handleUpdate('Ships', clickedCountryName)}>Ships: {categoryNumbers.Ships}</button>
              <button onClick={() => handleUpdate('Naval weapons', clickedCountryName)}>Naval weapons: {categoryNumbers.Navalweapons}</button>
              <button onClick={() => handleUpdate('Air defence systems', clickedCountryName)}> Air defence: {categoryNumbers.Airdefencesystems}</button>
              <button onClick={() => handleUpdate('Missiles', clickedCountryName)}>Missiles: {categoryNumbers.Missiles}</button>
              <button onClick={() => handleUpdate('Sensors', clickedCountryName)}>Sensors: {categoryNumbers.Sensors}</button>
              <button onClick={() => handleUpdate('Engines', clickedCountryName)}>Engines: {categoryNumbers.Engines}</button>
              <button onClick={() => handleUpdate('Other', clickedCountryName)}>Other: {categoryNumbers.Other}</button>
        </div>
    <div className="map-with-content-container">
      <div className='content-container'>
          <MapContainer center={position} zoom={2} style={{ height: '600px', width: '100%' }} maxBounds={bounds}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {geoData && (
          <GeoJSON data={geoData} onEachFeature={onEachCountry} style={style}/>
)}
          </MapContainer>
      </div>
      <div className='content-container'>
        <h3 className='country-name'> United States arms sales to: {clickedCountryName}</h3>
        <h3> </h3>
        <div>
        <table className="table table-hover">
                    <thead>
                        <tr className='table-primary'>
                            <th scope='col'>Order year</th>
                            <th scope='col'>Ordered</th>
                            <th scope='col'>Designation</th>
                            <th scope='col'>Description</th>
                            <th scope='col'>Category</th>
                            <th scope='col'>Delivered</th>
                            <th scope='col'>Delivery year/s</th>
                            <th scope='col'>Comments</th>
                            <th scope='col'>TIV per unit</th>
                            <th scope='col'>TIV total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tradeData?.map(trade => (
                            <tr key={trade.id}>
                                <td>{trade.order_year}</td>
                                <td>{trade.numbers_ordered}</td>
                                <td>{trade.designation}</td>
                                <td>{trade.description}</td>
                                <td>{trade.Armament_Category.armament_category}</td>
                                <td>{trade.numbers_delivered}</td>
                                <td>{trade.delivery_year_s}</td>
                                <td>{trade.comments}</td>
                                <td>{trade.tiv_per_unit}</td>
                                <td>{trade.tiv_total_order}</td>
                            </tr>
                        ))}
                    </tbody>
          </table>
        </div>
      </div>
    </div>
    <p>
    All sources taken from Stockholm International Peace Research Institute (SIPRI). Per SPIRI: SIPRI trend-indicator values (TIVs) are in millions.<br></br>
    A '0' for 'SIPRI TIV of delivered weapons' indicates that the volume of deliveries is between 0 and 0.5 million SIPRI TIV; and an empty field indicates that no deliveries have been identified. <br></br>

    </p>
    </div>
  );
};

export default USMap;