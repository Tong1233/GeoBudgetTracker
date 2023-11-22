// MapComponent.jsx

/* global google */
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, HeatmapLayer } from '@react-google-maps/api';

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

const MapComponent = ({ width, height, zoom, currentLocation, setCurrentLocation, CallBackLocation, showHeatMap, heatmapData}) => {

    const [isScriptLoaded, setScriptLoaded] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);
    //const [currentLocation, setCurrentLocation] = useState(null);

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
    }, []);


    const handleMapMovement = (event) => {
        const { latLng } = event;
        setCurrentLocation({ lat: latLng.lat(), lng: latLng.lng() });
        CallBackLocation({ lat: latLng.lat(), lng: latLng.lng() });
    };


    const containerStyle = {
        width: width || '80vw', // Use the provided width or a default value
        height: height || '80vh', // Use the provided height or a default value
        margin: 'auto', // Center the map horizontally
    };

    const center = {
        lat: currentLocation?.lat || 43.70, // Latitude of Toronto, Canada
        lng: currentLocation?.lng ||-79.42, // Longitude of Toronto, Canada
    };

    const onLoad = (map) => {
        setMapInstance(map);
    };

    const onUnmount = () => {
        setMapInstance(null); // Clear the map instance on unmount
        setScriptLoaded(false);
    };

    return (
        <LoadScriptOnlyIfNeeded googleMapsApiKey="AIzaSyALYG3CifqXPLPfKvDc2cLwsx92ttWOoJ0" libraries={libraries}>
            
            {isScriptLoaded && (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={zoom || 11}
                    onClick={handleMapMovement}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                >
                    {showHeatMap && (
                        <HeatmapLayer
                            data={heatmapData}
                            options={{ radius: 20, opacity: 0.6 }}
                        />
                    )}
                    
                    {currentLocation && (
                        <Marker
                            position={currentLocation}
                            draggable={true} // Allow the marker to be dragged
                            onDragEnd={handleMapMovement} // Handle drag end event
                        />
                    )}
                </GoogleMap>)}
            
        </LoadScriptOnlyIfNeeded>
    );
};

export default MapComponent;