/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import MapComponent from './HeatMapComponent';
import LineGraph from './LineGraph';


const Dashboard = ({expenses, setExpenses, IsSignedin, DemoData, DataOption}) => {
    //const [isDataFetched, setIsDataFetched] = useState(false);
    const [DashboardExpenseData, setDashboardExpenseData] = useState([]);
    const [totalamount, settotalamount] = useState();

    useEffect(() => {
        if(IsSignedin && expenses) {
            setDashboardExpenseData(expenses);
          
        }
        else {
            setDashboardExpenseData(DemoData);
        }
       
    }, [IsSignedin, expenses, DemoData]);

    useEffect(() => {
        settotalamount(calculateTotalAmount(DashboardExpenseData));
    }, [DashboardExpenseData]);

    useEffect(() => {
        if(IsSignedin == false) {
            setDashboardExpenseData(DemoData);
        }
       
    }, []);

   
    function calculateTotalAmount(data) {
        let totalAmount = 0;

        for (let i = 0; i < data.length; i++) {
            totalAmount += data[i].amount;
        }

        return parseFloat(totalAmount.toFixed(2));
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <div
                style={{
                position: 'relative',
                }}
            >
                {/* Credit card Text */}
                <p style={{ textAlign: 'center', color: 'black', fontWeight: 'bold', fontSize: '18px' }}>
                {IsSignedin? 'Total Expenses:':'(Guest-Demo) Total Expenses:'} ${totalamount} 
                </p>
            </div>
            <div> <LineGraph rawdataexpenses={DashboardExpenseData} /> </div>
            <div> <MapComponent expenses={DashboardExpenseData}/> </div>
        </div>
    );
};
export default Dashboard;
