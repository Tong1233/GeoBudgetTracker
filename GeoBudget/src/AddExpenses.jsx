/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddExpenseForm from './AddExpenseForm';

const ExpensesComponent = ({expenses, setExpenses, IsSignedin, DemoData, setDemoData, serverlink, DataOption, user, fetchExpenses, fetchLocalExpenses}) => {

    const handleExpenseAdded = () => {
        if(!IsSignedin && DataOption == 'demo') {
            setDemoData([...DemoData]);
        }
        else if (IsSignedin && DataOption == 'server') {
            fetchExpenses();
        }
        else if (DataOption == 'local') {
            fetchLocalExpenses();
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            {/* Left side with input form */}
            <div style={{ flex: 1}}>
                <AddExpenseForm onExpenseAdded={handleExpenseAdded} IsSignedin={IsSignedin} DemoData={DemoData} setDemoData={setDemoData} serverlink={serverlink} user={user} DataOption={DataOption}/>
            </div>

        </div>
    );
};

export default ExpensesComponent;