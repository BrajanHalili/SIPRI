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
    const [idCounter, setIDCounter] = useState(2);
    const [sortOrder, setSortOrder] = useState([
      {
        id: 1,
        Category: "order_year", 
        Order_Type: "DESC"
      }
    ]);
    const [sortIsVisible, setSortIsVisible] = useState(false)

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

    const sortButton = () => {
        setSortIsVisible(!sortIsVisible);
    }

    const handleSortChange = (event, index) => {
      const {value} = event.target;
      //console.log('Before update:', sortOrder);

      setSortOrder((prevOrder) =>
        prevOrder.map((category, i) =>
          i === index ? { ...category, Category: value } : category
        )
      );
      // After setting the new category value to the correct position, eliminate all other sorts that have the same category name
      setSortOrder((prevState) => prevState.filter((category) => (category.Category === value && category.id === sortOrder[index].id) || category.Category !== value));
    }

    const handleOrderTypeChange = (index,event) => {
        const {value} = event.target;
        //console.log('Before update:', sortOrder);
        setSortOrder((prevOrder) => 
          prevOrder.map((category, i) =>
            i === index ? { ...category, Order_Type: value } : category
          )
        );
    }

    const addSortCategory = () => {
      const size = sortOrder.length;
      setIDCounter((prevIDCounter) => prevIDCounter + 1);
      let newID = idCounter;
      if(size < 10){
        let newSort = {
          id: newID,
          Category: "",
          Order_Type: "DESC"
        }
        setSortOrder(prevState => [
          ...prevState,
          newSort
        ])
      }
    }


    const removeSortCategory = (index) => {
      let ID = sortOrder[index].id;
      //console.log(sortOrder);
        setSortOrder((prevOrder) => prevOrder.filter((category) => ID != category.id));
    }


    const submitSort = () => {
      setSortOrder((prevOrder) => prevOrder.filter((category) => category.Category != ""));  //filter out the empty ones
      if(tradeData == null)
        return;
      const nestedSort = (data,sortOrder) => {
        return data.sort((a,b) => {
          for(const criteria of sortOrder){
            let Category = criteria.Category;   //Get category
            const Order_Type = criteria.Order_Type;  //Get order type
            const order = Order_Type === 'DESC' ? -1 : 1   //get value depending on order type
            
            let valueA;
            let valueB;
            if(Category === "Armament_Category.armament_category"){   //check whether it is about armament category since that is data taken from a separate table
              valueA = a.Armament_Category.armament_category;
              valueB = b.Armament_Category.armament_category;
            }
            else {
              valueA = a[Category];
              valueB = b[Category];
            }
            

            if (valueA === undefined || valueB === undefined) {
              console.warn(`Field "${Category}" does not exist in the data.`);
              continue;
            }

            if (typeof valueA === 'string' && typeof valueB === 'string') {
              valueA = valueA.toLowerCase();
              valueB = valueB.toLowerCase();
            }

            if (!isNaN(valueA) && !isNaN(valueB)) {
              valueA = Number(valueA);
              valueB = Number(valueB);
            }

            
            if (valueA < valueB) return -1 * order;
            if (valueA > valueB) return 1 * order;
          }
          return 0;
        });
      };
      nestedSort(tradeData, sortOrder);
    };

    const moveElement = (sortOrder, index, direction) => {
      if (index < 0 || index >= sortOrder.length) {
        console.warn('Invalid index: Index out of bounds.');
        return sortOrder;
      }

      const newSortOrder = [...sortOrder];
      const newIndex = direction === 'up' ? index - 1 : index + 1;

      if(newIndex <0 || newIndex >= sortOrder.length){
        console.warn('Invalid new index. Cannot move element.');
        return sortOrder;
      }

      const [element] = newSortOrder.splice(index,1);
      newSortOrder.splice(newIndex, 0, element);
      return newSortOrder;
    };

    const handleMoveUp = (index) => {
      setSortOrder((prevState) => moveElement(prevState,index,'up'));
    };

    const handleMoveDown = (index) => {
      setSortOrder((prevState) => moveElement(prevState, index, 'down'));
    }
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
        <h3 className='country-name'> United States arms sales to: {clickedCountryName}  <button className='sort-button' onClick={() => sortButton()} > Sort By</button> </h3>
        { sortIsVisible &&
          <div className='sort-order-container' >
            Pick the sorting order:
            <div className="sort-order-item">
                  {sortOrder?.length > 0 ? (
                    sortOrder.map((sortPair, index) => (
                      <label key={index} className='sortForm selectSortForm'>
                        <div className='order'>
                          Order #{index + 1}
                        </div>
                        
                        <select
                          value={sortPair.Category}
                          onChange={(event) => handleSortChange(event,index)}
                          className='selectSortForm'
                        >
                          <option value=""></option>
                          <option value="order_year">Order year</option>
                          <option value="numbers_ordered">Ordered</option>
                          <option value="designation">Designation</option>
                          <option value="description">Description</option>
                          <option value="Armament_Category.armament_category">Category</option>
                          <option value="numbers_delivered">Delivered</option>
                          <option value="delivery_year_s">Delivery year/s</option>
                          <option value="comments">Comments</option>
                          <option value="tiv_per_unit">TIV per unit</option>
                          <option value="tiv_total_order">TIV total</option>
                        </select>
                        <select
                          value={sortPair.Order_Type}
                          onChange={(event) => handleOrderTypeChange(index, event)}
                          className='selectSortForm'
                        >
                          <option value="DESC">DESC</option>
                          <option value="ASC">ASC</option>
                        </select>
                        <div className="button-group">
                          <button className="move-button" onClick={() => handleMoveUp(index)}   disabled={index === 0} title="Move Up">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z" />
                            </svg>
                          </button>
                          <button className="move-button" onClick={() => handleMoveDown(index)}   disabled={index === sortOrder.length - 1} title="Move Down">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
                            </svg>
                          </button>
                          <button className="remove-button" onClick={() => removeSortCategory(index)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="currentColor"
                              viewBox="0 0 16 16"
                            >
                              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                            </svg>
                          </button>
                        </div>

                      </label>
                    ))
                  ) : (
                    <p>No sort order available.</p>
                  )}
            </div>
            <div className='button-group'>
              <button className='add-button' onClick={addSortCategory}> Add category </button>
              <button className='submit-button' onClick={submitSort}> Submit</button>
            </div>
          </div>}

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