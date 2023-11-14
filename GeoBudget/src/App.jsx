import React, { useState } from 'react';
import MapComponent from './MapComponent';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainDashboard from './MainDashboard';
import IncomeComponent from './IncomeComponent';
import ExpensesComponent from './ExpensesComponent';

const GeoBudget = () => {

    return (
        <Router>
            <div style={{ display: 'flex', height: '100vh' }}>
                {/* Sidebar */}
                <div style={{ width: '200px', background: '#f0f0f0', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                    {/* Placeholder for Image */}
                    <div style={{ marginBottom: '20px', height: '100px', backgroundColor: 'lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* You can add an image here */}
                        Image Placeholder
                    </div>

                    {/* Navigation Links */}
                    <nav style={{ listStyleType: 'none', padding: 0 }}>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            <li>
                                <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Main Dashboard</Link>
                            </li>
                            <li>
                                <Link to="/income" style={{ textDecoration: 'none', color: 'black' }}>Income</Link>
                            </li>
                            <li>
                                <Link to="/expenses" style={{ textDecoration: 'none', color: 'black' }}>Expenses</Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                {/* Content */}
                <div style={{ flex: 1, padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<MainDashboard />} />
                        <Route path="/income" element={<IncomeComponent />} />
                        <Route path="/expenses" element={<ExpensesComponent />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};


export default GeoBudget;