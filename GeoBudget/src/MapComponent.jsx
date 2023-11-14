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

const MapComponent = () => {

    const [isScriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        // Check if the Google Maps API is already loaded
        if (window.google && window.google.maps) {
            setScriptLoaded(true);
            //onGoogleMapsApiLoad(true); // Map is loaded
            console.log('Google Maps API already loaded!');
            return;
        }
    }, );

    const containerStyle = {
        width: '60vw', // Adjust the width as needed
        height: '60vh', // Adjust the height as needed
        margin: 'auto', // Center the map horizontally
    };

    const center = {
        lat: -34.397,
        lng: 150.644,
    };

    return (
        <LoadScriptOnlyIfNeeded googleMapsApiKey="AIzaSyALYG3CifqXPLPfKvDc2cLwsx92ttWOoJ0">
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={8}>
                <Marker position={center} />
            </GoogleMap>
        </LoadScriptOnlyIfNeeded>
    );
};

export default MapComponent;