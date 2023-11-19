import React, { useState } from 'react';
import MapComponent from './MapComponent';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainDashboard from './MainDashboard';
import ExpensesComponent from './ExpensesComponent';

const GeoBudget = () => {

    const styles = {
        navLink: {
            textDecoration: 'none',
            textAlign: 'center',
            color: 'black',
            padding: '10px',
            marginBottom: '5px',
            borderRadius: '10px',
            border: '3px solid black',
            backgroundColor: 'none', // Change this to your desired default button color
            display: 'block',
            fontSize: '17px', // Change this to your desired font size
            transition: 'background-color 0.3s', // Add a smooth transition for the background color change
        },
    };

    return (
        <Router>
            <div style={{ display: 'flex', height: '100vh' }}>
                {/* Sidebar */}
                <div style={{ width: '200px', background: '#f0f0f0', padding: '20px', display: 'flex', flexDirection: 'column', borderRight: '1px solid black' }}>
                    {/* Placeholder for Image */}
                    <div style={{ marginBottom: '20px', height: '100px', backgroundColor: 'lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* You can add an image here */}
                        Image Placeholder
                    </div>

                    {/* Navigation Links */}
                    <nav style={{ listStyleType: 'none', padding: 0 }}>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            <li>
                                <Link to="/" style={styles.navLink}>Main Dashboard</Link>
                            </li>
                            <li>
                                <Link to="/expenses" style={styles.navLink}>Modify Expenses</Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* Content */}
                <div style={{ flex: 1, padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<MainDashboard />} />
                        <Route path="/expenses" element={<ExpensesComponent />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};



export default GeoBudget;