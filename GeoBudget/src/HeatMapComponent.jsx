/* eslint-disable react/prop-types */
// MapComponent.jsx

/* global google */
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, HeatmapLayer } from '@react-google-maps/api';

const libraries = ["visualization"];
class LoadScriptOnlyIfNeeded extends LoadScript {

    componentDidMount() {
        const cleaningUp = true;
        const isBrowser = typeof document !== 'undefined'; // require('@react-google-maps/api/src/utils/isbrowser')
        const isAlreadyLoaded =
            window.google &&
            window.google.maps &&
            document.querySelector('body.first-hit-completed'); // AJAX page loading system is adding this class the first time the app is loaded
        if (!isAlreadyLoaded && isBrowser) {
            // @ts-ignore
            if (window.google && !cleaningUp) {
                console.error('google api is already presented');
                return;
            }

            this.isCleaningUp().then(this.injectScript);
        }

        if (isAlreadyLoaded) {
            this.setState({ loaded: true });
        }
    }
}

const HeatMapComponent = ({ width, height, zoom, expenses}) => {

    const [isScriptLoaded, setScriptLoaded] = useState(false);
    const [showHeatMap, setshowHeatMap] = useState(false);
    const [isMapClicked, setIsMapClicked] = useState(false);
    const [heatmapData, setHeatmapData] = useState([]);

    const makeheatmap = () => {
        //console.log(expenses.length);
        if (window.google && window.google.maps && window.google.maps.LatLng) {

            setHeatmapData(expenses.map((expense) => {
                const location = new window.google.maps.LatLng(expense.lat || 0, expense.lng || 0);
                //console.log('Lat:', expense.lat, 'Lng:', expense.lng); // Add logging to check lat and lng values
                return {
                    location,
                    weight: expense?.amount || 1,
                };
            }));
        } else {
            requestAnimationFrame(makeheatmap);
        }
    };

    const checkScriptLoaded = () => {
        if (window.google && window.google.maps) {
            console.log('Google Maps API loaded successfully');
            setScriptLoaded(true);
        } else {
            requestAnimationFrame(checkScriptLoaded);
        }
    };

    useEffect(() => {
        checkScriptLoaded();
        if (expenses.length > 0)
            makeheatmap();

        // Cleanup logic when the component unmounts
        return () => {
            // Clear any lingering Google Maps API script
            const scriptElements = document.getElementsByTagName('script');
            Array.from(scriptElements).forEach((script) => {
                if (script.src.includes('maps.googleapis.com')) {
                    script.parentNode.removeChild(script);
                }
            });
        }
        
    }, [expenses]);


    const handleMap = () => {
       if (expenses.length > 0)
          makeheatmap();

        //setHeatmapData(heatmapData);
        setshowHeatMap(true);
        setIsMapClicked(true);
    };


    const containerStyle = {
        width: width || '50vw', // Use the provided width or a default value
        height: height || '60vh', // Use the provided height or a default value
        margin: 'auto', // Center the map horizontally
    };

    const center = {
        lat: 43.70, // Latitude of Toronto, Canada
        lng: -79.42, // Longitude of Toronto, Canada
    };

    const onUnmount = () => {
        setshowHeatMap(false);
        setHeatmapData(null);
        setScriptLoaded(false);
        //console.log("Unmounteed!");
        
    };

    const overlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: isMapClicked ? 'none' : 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        pointerEvents: 'none',
    };

    return (
        <LoadScriptOnlyIfNeeded googleMapsApiKey="AIzaSyALYG3CifqXPLPfKvDc2cLwsx92ttWOoJ0" libraries={libraries}>
            
            {isScriptLoaded && (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={zoom || 11}
                    onClick={handleMap}
                    onUnmount={onUnmount}
                >
                    {showHeatMap && (
                        <HeatmapLayer
                            data={heatmapData}
                            options={{ radius: 20, opacity: 0.6 }}
                        />
                    )}
                    
                    <div style={overlayStyle} onClick={handleMap}>
                        <div style={{ fontSize: '40px', color: 'white' }}>Click to Show Spending Heatmap</div>
                    </div>
                </GoogleMap>)}
            
            
        </LoadScriptOnlyIfNeeded>
    );
};

export default HeatMapComponent;