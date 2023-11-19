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
                <LineGraph />
            </div>

            <div style={{ flex: 1, paddingTop: '84px' }}>
                {isDataFetched && <MapComponent expenses={expenses} />}
            </div>
        </div>
    );
};

export default Dashboard;
