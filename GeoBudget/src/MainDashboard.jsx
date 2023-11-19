import React, { useState, useEffect } from 'react';
import MapComponent from './HeatMapComponent';
import LineGraph from './LineGraph';


const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false);

    useEffect(() => {
        const cachedExpenses = JSON.parse(localStorage.getItem('expenses'));

        if (cachedExpenses) {
            setExpenses(cachedExpenses);
            setIsDataFetched(true);
        } else {
            fetchExpenses();
        }
    }, []);

    const fetchExpenses = () => {
        fetch('http://localhost:5000/expenses')
            .then(response => response.json())
            .then(data => {
                setExpenses(data);
                setIsDataFetched(true);
                localStorage.setItem('expenses', JSON.stringify(data));
            })
            .catch(error => {
                console.error('Error fetching expenses:', error);
            });
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
                <h2>Dashboard</h2>
                {/* Transparent rectangle with rounded corners and circles */}
                <div
                    style={{
                        width: '30vw',
                        height: '35vh', // Adjust the height of the rectangle
                        backgroundColor: 'rgba(169, 169, 169, 0.3)', // Set the background color with transparency
                        border: '3px solid black',
                        //textAlign: 'center',
                        borderRadius: '30px', 
                        position: 'relative', // Set position to enable absolute positioning of circles
                        marginBottom: '20px', // Adjust the spacing between the rectangle and LineGraph
                    }}
                >
                    {/* Two overlapping circles in the bottom left corner */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '8%',
                            left: '73%',
                            display: 'flex',
                        }}
                    >
                        <div
                            style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor:'rgba(255, 0, 0, 0.9)',
                                marginRight: '-20px', // Adjust the spacing between circles
                            }}
                        ></div>
                        <div
                            style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255, 165, 0, 0.8)',
                            }}
                        ></div>
                    </div>

                    {/* Add any content or text inside the rectangle if needed */}
                    <p style={{ textAlign: 'center', paddingTop: '10px', color: 'black' }}>Above the LineGraph</p>
                </div>


                {/* LineGraph component */}
                <div style={{ flex: 1 }}>
                    <LineGraph />
                </div>
            </div>

            <div style={{ flex: 1, paddingTop: '84px' }}>
                {isDataFetched && <MapComponent expenses={expenses} />}
            </div>
        </div>
    );
};

export default Dashboard;
