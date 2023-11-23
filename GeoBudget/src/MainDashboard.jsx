import React, { useState, useEffect } from 'react';
import MapComponent from './HeatMapComponent';
import LineGraph from './LineGraph';


const Dashboard = ({ CallBackDatabaseConnection }) => {
    const [expenses, setExpenses] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [IsDatabaseConnected, setIsDatabaseConnected] = useState(false);
    const totalAmount = calculateTotalAmount(expenses);
    const NumberofExpenses = calculateNumber(expenses);

    useEffect(() => {
        checkconnection();
        //console.log(IsDatabaseConnected);
        const cachedExpenses = JSON.parse(localStorage.getItem('expenses'));

        if (cachedExpenses) {
            setExpenses(cachedExpenses);
            setIsDataFetched(true);
        } else {
            fetchExpenses();
        }

        // Set up interval for periodic check (every 5 seconds)
        const intervalId = setInterval(() => {
            checkconnection();
        }, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const fetchExpenses = () => {
        fetch('https://geobackend.onrender.com/expenses')
            .then(response => response.json())
            .then(data => {
                setExpenses(data);
                setIsDataFetched(true);
                localStorage.setItem('expenses', JSON.stringify(data));
                setIsDatabaseConnected(true);
            })
            .catch(error => {
                setIsDatabaseConnected(false);
                setIsDataFetched(true);
                console.error('Error fetching expenses:', error);
            });
    };

    const checkconnection = async () => {//to update path for just checking health
        try {
            const response = await fetch('https://geobackend.onrender.com/expenses'); // Replace with your actual endpoint
            if (response.ok) {
                return setIsDatabaseConnected(true);
            } else {
                return setIsDatabaseConnected(false);
            }
        } catch (error) {
            console.error('Error checking database connection:', error);
            return setIsDatabaseConnected(false);
        }
    };

    useEffect(() => {
        //console.log(IsDatabaseConnected);
        CallBackDatabaseConnection(IsDatabaseConnected);
    }, [IsDatabaseConnected]);
   
    function calculateTotalAmount(expenses) {
        let totalAmount = 0;

        for (let i = 0; i < expenses.length; i++) {
            totalAmount += expenses[i].amount;
        }

        return parseFloat(totalAmount.toFixed(2));
    }

    function calculateNumber(expenses) {
        let numexp = 0;

        if (expenses.length > 0)
            numexp = expenses.length;

        return numexp;
    }

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
                <h2>GeoExpenses Dashboard</h2>
                {/* Transparent rectangle with rounded corners and circles */}
                <div
                    style={{
                        width: '30vw',
                        height: '35vh', // Adjust the height of the rectangle
                        backgroundColor: 'rgba(169, 169, 169, 0.3)', // Set the background color with transparency
                        border: '3px solid black',
                        //textAlign: 'center',
                        borderRadius: '30px', 
                        position: 'relative', 
                        marginBottom: '20px', 
                    }}
                >
                    {/* Two overlapping circles in the bottom right corner */}
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

                    {/* Creditcard Text */}
                    <p style={{ textAlign: 'left', paddingLeft: '30px', paddingTop: '10px', color: 'black', fontWeight: 'bold', fontSize: '20px' }}>
                        Total Expenses:   <br /> $ {totalAmount}
                    </p>
                    <p style={{ textAlign: 'left', paddingLeft: '30px', color: 'black', fontWeight: 'bold', fontSize: '15px' }}>Database Entries: {NumberofExpenses}</p>
                    <p style={{ textAlign: 'left', paddingLeft: '30px', color: 'black', fontWeight: 'bold', fontSize: '15px' }}>Average Purchase Price: $ {NumberofExpenses > 0
                        ? parseFloat((totalAmount / NumberofExpenses).toFixed(2))
                        : '0'}</p>
                </div>


                {/* LineGraph component */}
                <div style={{ flex: 1 }}>
                    {isDataFetched && <LineGraph rawdataexpenses={expenses} />}
                </div>
            </div>

            <div style={{ flex: 1, paddingTop: '84px' }}>
                {isDataFetched && <MapComponent expenses={expenses} />}
            </div>
        </div>
    );
};

export default Dashboard;
