import React, { useState } from 'react';
import MapComponent from './MapComponent';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainDashboard from './MainDashboard';
import ExpensesComponent from './ExpensesComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';

library.add(faPowerOff);

const GeoBudget = () => {
    const [power, setPower] = useState(false);

    function DatabaseConnection(connection) {
        setPower(connection);
    }

    const styles = {
        navLink: {
            textDecoration: 'none',
            textAlign: 'center',
            color: 'black',
            padding: '10px',
            marginBottom: '5px',
            borderRadius: '10px',
            border: '3px solid black',
            backgroundColor: 'none', 
            display: 'block',
            fontSize: '17px', 
            transition: 'background-color 0.3s', 
        },
    };

    return (
        <Router>
            <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'auto' }}>
                {/* Sidebar */}
                <div style={{ width: '200px', background: '#f0f0f0', padding: '20px', display: 'flex', flexDirection: 'column', borderRight: '1px solid black' }}>
                  
                    <div style={{ marginBottom: '20px', marginTop: '20px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>  
                        <FontAwesomeIcon icon={faPowerOff} style={{ color: power ? 'green' : 'red', fontSize: 120 }}/>
                    </div>
                    <div style={{ color: power ? 'green' : 'red', fontWeight: 'bold', fontSize: '12px', display: 'flex', justifyContent: 'center' }}>
                        {power ? 'Connected to Database' : 'Connecting to Database...'} 
                    </div>
                    {/* Navigation Links */}
                    <nav style={{ listStyleType: 'none', padding: 0 }}>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            <li>
                                <Link to="/" style={styles.navLink} onMouseOver={(e) => e.target.style.backgroundColor = 'lightgray'} onMouseOut={(e) => e.target.style.backgroundColor = ''}>
                                    Main Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/expenses" style={styles.navLink} onMouseOver={(e) => e.target.style.backgroundColor = 'lightgray'} onMouseOut={(e) => e.target.style.backgroundColor = ''}>Modify Expenses</Link>
                            </li>
                        </ul>
                    </nav>
                    <div style={{bottom: '0', fontSize: '12px', fontStyle: 'italic', display: 'flex', justifyContent: 'center'}}>
                        
                        Written by Tong Wang
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<MainDashboard CallBackDatabaseConnection={DatabaseConnection} />} />
                        <Route path="/expenses" element={<ExpensesComponent CallBackDatabaseConnection={DatabaseConnection} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};



export default GeoBudget;