/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddExpenseForm from './AddExpenseForm';

const ExpensesComponent = ({expenses, setExpenses, IsSignedin, DemoData, setDemoData, serverlink, DataOption}) => {

    const handleExpenseAdded = () => {
        if(!IsSignedin) {
            setDemoData([...DemoData]);
        }
        else{
            fetchExpenses();
        }
    };

    const fetchExpenses = () => {
        fetch(serverlink + '/expenses')
            .then(response => response.json())
            .then(data => {
                setExpenses(data);
                localStorage.setItem('expenses', JSON.stringify(data));
            })
            .catch(error => {
                console.error('Error fetching expenses:', error);
            });
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            {/* Left side with input form */}
            <div style={{ flex: 1}}>
                <AddExpenseForm onExpenseAdded={handleExpenseAdded} IsSignedin={IsSignedin} DemoData={DemoData} setDemoData={setDemoData} serverlink={serverlink} />
            </div>

        </div>
    );
};

export default ExpensesComponent;