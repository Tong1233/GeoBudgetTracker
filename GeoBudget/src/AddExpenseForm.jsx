import React, { useState } from 'react';
import MapComponent from './MapComponent';

const AddExpenseForm = ({ onExpenseAdded }) => {

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [name, setname] = useState('');

    const currentDate = new Date().toLocaleDateString('en-CA').split('T')[0];// Get the current date in the format "YYYY-MM-DD"
    const [date, setdate] = useState(currentDate);
    const [currentLocation, setCurrentLocation] = useState(null);

    const handleMapEvent= (event) => {
        const { latLng } = event;
        setCurrentLocation({ lat: latLng.lat(), lng: latLng.lng() });
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

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(currentLocation?.lat, currentLocation?.lng);
        fetch('http://localhost:5000/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date,
                name,
                amount: parseFloat(amount),
                description,
                lat: currentLocation?.lat || 0, 
                lng: currentLocation?.lng || 0, 
            }),
        })
            .then(response => response.json())
            .then(data => {
                onExpenseAdded();
                console.log(data);
            })
            .catch(error => console.error('Error adding expense:', error));
    };

    return (
        <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '23vw',
            padding: '10px 0',  // Set top and bottom padding
            paddingLeft: '12px',  // Set left padding
            paddingRight: '25px',  // Set right padding
            border: '1px solid black', // Add border for the rectangle
            borderRadius: '20px', // Add rounded corners
        }}>

            <div style={{ marginBottom: '2px', width: '100%' }}>
                <label style={{ marginBottom: '5px', textAlign: 'left', width: '100%' }}>
                    Date:
                    <input
                        type="text"
                        value={date}
                        onChange={(e) => setdate(e.target.value)}
                        style={{ width: '100%', padding: '5px' }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: '2px', width: '100%' }}>
                <label style={{ marginBottom: '5px', textAlign: 'left', width: '100%' }}>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                        placeholder="Required"
                        style={{ width: '100%', padding: '5px' }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: '2px', width: '100%' }}>
                <label style={{ marginBottom: '5px', textAlign: 'left', width: '100%' }}>
                    Amount:
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Required"
                        style={{width: '100%', padding: '5px' }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: '2px', width: '100%' }}>
                <label style={{ marginBottom: '5px', textAlign: 'left', width: '100%' }}>
                    Description:
                    <textarea
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optional"
                        rows="3"  
                        style={{ width: '100%', padding: '5px' }}
                    />
                </label>
            </div>
            <label style={{ marginBottom: '5px', textAlign: 'center', width: '100%' }}>     
                <button
                    onClick={getCurrentLocation}
                    style={{
                        background: 'transparent',
                        border: '1px solid black',
                        color: 'black', // Change the color to match your design
                        fontSize: '14px', // Adjust the font size
                        padding: '5px', // Adjust the padding
                        cursor: 'pointer',
                    }}
                >
                    Set Location (Optional)
                </button>
            </label>
            <MapComponent width="24vw" height="35vh" zoom={9} currentLocation={currentLocation} setCurrentLocation={setCurrentLocation}  CallBackLocation={handleMapEvent}/> 
            <div style={{ marginTop: '10px', width: '40%' }}>
                <button type="submit" style={{ width: '100%', padding: '10px', margin: 'auto' }}>Add Expense</button>
            </div>
        </form>
    );
};


export default AddExpenseForm;