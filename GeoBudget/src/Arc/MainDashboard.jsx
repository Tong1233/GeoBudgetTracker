import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [heatmapdata, setHeatmapData] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [map, setMap] = useState(null);
    const [showHeatMap, setshowHeatMap] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, []);

    useEffect(() => {
        fetchExpenses();
        makeheatmap();
    }, [expenses]);

    const fetchExpenses = () => {
        fetch('http://localhost:5000/expenses')
            .then(response => response.json())
            .then(data => {
                setExpenses(data);
                setIsDataFetched(true);
                setshowHeatMap(true);
            })
            .catch(error => {
                console.error('Error fetching expenses:', error);
                setshowHeatMap(false); // Set showHeatMap to false in case of an error
            });
    };

    const makeheatmap = () => {
        if (window.google && window.google.maps && window.google.maps.LatLng && isDataFetched) {
            const mapContainer = document.getElementById('map');

            if (!mapContainer) {
                console.error('Map container element not found');
                return;
            }

            setHeatmapData(expenses.map((expense) => {
                const location = new window.google.maps.LatLng(expense.lat || 0, expense.lng || 0);
                return {
                    location,
                    weight: expense?.amount || 1,
                };
            }));
        } else {
            setTimeout(makeheatmap, 10);
        }
    };

    return (
        <div>
            <h2>Main Dashboard</h2>
            {isDataFetched && <MapComponent showHeatMap={showHeatMap} heatmapData={heatmapdata} />}
            <div id="map" style={{ height: '0px' }}></div> 
        </div>//this is an invisible map so that makeheatmap can detect that a container is created
    );
};

export default Dashboard;