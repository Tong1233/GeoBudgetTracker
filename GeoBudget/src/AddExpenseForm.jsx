import React, { useState } from 'react';
import MapComponent from './MapComponent';
import { Data } from '@react-google-maps/api';

const AddExpenseForm = ({ onExpenseAdded, IsSignedin, DemoData, setDemoData, serverlink, user, DataOption }) => {

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [name, setname] = useState('');

    const currentDate = new Date().toLocaleDateString('en-CA').split('T')[0];// Get the current date in the format "YYYY-MM-DD"
    const [date, setdate] = useState(currentDate);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [formColorDate, setColorDate] = useState('1px solid black');
    const [formColorName, setColorName] = useState('1px solid black');
    const [formColorAmount, setColorAmount] = useState('1px solid black');
    const [formColorLocation, setColorLocation] = useState('black');
    const [buttonText, setButtonText] = useState('Add Expense');
    const [buttonColor, setButtonColor] = useState('');

    const handleMapEvent = (event) => {
        
        const { latLng } = event;
        if (latLng) 
            setCurrentLocation({ lat: latLng?.lat(), lng: latLng?.lng() });
        return;
       
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
        let mistake=false;
        let buttonerrortext='Error' 

        try {

            if (typeof date !== 'string' || date.trim().length === 0) {
                setColorDate('2px solid red');
                mistake=true;
            }

            // Validate name
            if (typeof name !== 'string' || name.trim().length === 0) {
                setColorName('2px solid red');
                mistake=true;
            }

            // Validate amount
            const amountValue = parseFloat(amount);
            if (isNaN(amountValue)) {
                setColorAmount('2px solid red');
                mistake=true;
            }

            // Validate lat and lng
           
            if (currentLocation==null) {
                setColorLocation('red');
                mistake=true;
            }

            if(DataOption==='server' && !IsSignedin) {
                mistake=true;
                buttonerrortext='Need Login'
            }
        } catch (error) {
            console.error('Error in form data:', error);
            mistake=true;
        }

        if(!mistake && !IsSignedin && DataOption == 'demo')
        {
            const combinedarray = [...DemoData, {
                date,
                name,
                amount: parseFloat(amount),
                description,
                lat: currentLocation.lat, 
                lng: currentLocation.lng, 
            }]

            setDemoData(combinedarray);
            setColorDate('1px solid black');
            setColorName('1px solid black');
            setColorAmount('1px solid black');
            setColorLocation('black');
            mistake=false;
        }
        else if(!mistake && DataOption == 'local')
        {
            
            const financeAICount = localStorage.length;

            const timestamp = new Date().getTime(); // Using timestamp as part of the key

            const ID = `FinanceAI_${financeAICount + 1}_${timestamp}`; 
            
            localStorage.setItem(ID, JSON.stringify({date,
                name,
                amount: parseFloat(amount),
                description,
                id: ID,
                lat: currentLocation.lat, 
                lng: currentLocation.lng,
            }));
            onExpenseAdded();
            setColorDate('1px solid black');
            setColorName('1px solid black');
            setColorAmount('1px solid black');
            setColorLocation('black');
            mistake=false;
        }
        else if (!mistake && IsSignedin && DataOption == 'server' && user)
        {
            const email = user.email;
            fetch(serverlink +'/addexpenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                date,
                name,
                amount: parseFloat(amount),
                description,
                lat: currentLocation.lat, 
                lng: currentLocation.lng, 
            }),
        })
            .then(response => response.json())
            .then(data => {
                onExpenseAdded();
                setColorDate('1px solid black');
                setColorName('1px solid black');
                setColorAmount('1px solid black');
                setColorLocation('black');
                mistake=false;
            })
            .catch(error => {
                console.error('Error adding expense:', error);
                mistake=true;
                buttonerrortext='Error';
            });
        }

        if(mistake){
            setButtonText(buttonerrortext);
            setButtonColor('red');
        }
        else {
            setButtonText('Added!');
            setButtonColor('lightgreen');
        }
        
    
        // Reset the button text and background color after 3 seconds
        setTimeout(() => {
          setButtonText('Add Expense');
          setButtonColor('');
        }, 1000);
        
    };

    return (
        <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100vw',
            maxWidth: '450px',
            //minWidth: '350px'
        }}>

            <div style={{ marginBottom: '2px', width: '100%' }}>
                <label style={{ marginBottom: '5px', textAlign: 'left', fontSize: '1.2rem',width: '100%' }}>
                    Date:
                    <input
                        type="text"
                        value={date}
                        onChange={(e) => setdate(e.target.value)}
                        style={{ width: '100%', padding: '5px', border: formColorDate }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: '2px', width: '100%' }}>
                <label style={{ marginBottom: '5px', fontSize: '1.2rem',textAlign: 'left', width: '100%' }}>
                    Title:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                        placeholder="Required"
                        style={{ width: '100%', padding: '5px', border: formColorName }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: '2px', width: '100%' }}>
                <label style={{ marginBottom: '5px', fontSize: '1.2rem', textAlign: 'left', width: '100%' }}>
                    Amount:
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Required"
                        style={{ width: '100%', padding: '5px', border: formColorAmount }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: '2px', width: '100%' }}>
                <label style={{ marginBottom: '5px', fontSize: '1.2rem', textAlign: 'left', width: '100%' }}>
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
                    onClick={(e) => {
                        e.preventDefault(); // Prevent form submission
                        getCurrentLocation();
                    }}
                    style={{
                        background: 'transparent',
                        color: formColorLocation, // Change the color to match your design
                        border: '1px solid '+formColorLocation,
                        fontSize: '14px', // Adjust the font size
                        padding: '5px', // Adjust the padding
                        cursor: 'pointer',
                    }}
                >
                    Set Location (Required)
                </button>
            </label>
            <MapComponent width="460px" height="300px" zoom={9} currentLocation={currentLocation} setCurrentLocation={setCurrentLocation}  CallBackLocation={handleMapEvent}/> 
            <div style={{ marginTop: '20px', width: '40%' }}>
                <button type="submit" style={{ border: '1px solid black', width: '100%', padding: '10px', margin: 'auto', backgroundColor: buttonColor }}>{buttonText}</button>
            </div>
        </form>
    );
};


export default AddExpenseForm;