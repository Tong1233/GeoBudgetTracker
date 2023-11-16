// MapComponent.jsx
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

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

const MapComponent = ({ width, height, zoom, currentLocation, setCurrentLocation, CallBackLocation}) => {

    const [isScriptLoaded, setScriptLoaded] = useState(false);
    //const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        if (window.google && window.google.maps) {
            setScriptLoaded(true);
        }
    }, []);

    const handleMapMovement = (event) => {
        const { latLng } = event;
        setCurrentLocation({ lat: latLng.lat(), lng: latLng.lng() });
        CallBackLocation({ lat: latLng.lat(), lng: latLng.lng() });
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error('Error getting current location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    const containerStyle = {
        width: width || '60vw', // Use the provided width or a default value
        height: height || '60vh', // Use the provided height or a default value
        margin: 'auto', // Center the map horizontally
    };

    const center = {
        lat: currentLocation?.lat || 43.70, // Latitude of Toronto, Canada
        lng: currentLocation?.lng ||-79.42, // Longitude of Toronto, Canada
    };

    return (
        <LoadScriptOnlyIfNeeded googleMapsApiKey="AIzaSyALYG3CifqXPLPfKvDc2cLwsx92ttWOoJ0">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={zoom || 11}
                onClick={handleMapMovement}
            >
                {currentLocation && (
                    <Marker
                        position={currentLocation}
                        draggable={true} // Allow the marker to be dragged
                        onDragEnd={handleMapMovement} // Handle drag end event
                    />
                )}
            </GoogleMap>
        </LoadScriptOnlyIfNeeded>
    );
};

export default MapComponent;