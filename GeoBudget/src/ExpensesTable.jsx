/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddExpenseForm from './AddExpenseForm';

const ExpensesTable = ({expenses, setExpenses, IsSignedin, DemoData, setDemoData}) => {

    const [totalamount, settotalamount] = useState();
    const [DashboardExpenseData, setDashboardExpenseData] = useState([]);
    
    const handleDeleteExpense = async (expenseId) => {
        
        if(!IsSignedin) {
            const indexToDelete = DemoData.findIndex(obj => obj.id === expenseId);
            if (indexToDelete !== -1) {
                DemoData.splice(indexToDelete, 1);
                setDashboardExpenseData([...DemoData]);
            }
        }
        else
        {
            try {
                // Send a DELETE request to delete the expense by ID
                await axios.delete(`https://geobackend.onrender.com/expenses/${expenseId}`);
                // Fetch updated expenses after deletion
                fetchExpenses();
            } catch (error) {
                console.error('Error deleting expense:', error);
            }
        }
    };

    const fetchExpenses = () => {
        fetch ('https://geobackend.onrender.com/expenses')
            .then(response => response.json())
            .then(data => {
                setExpenses(data);
                localStorage.setItem('expenses', JSON.stringify(data));
            })
            .catch(error => {
                console.error('Error fetching expenses:', error);
            });
    };

    useEffect(() => {
        setDashboardExpenseData([]);
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


   
    function calculateTotalAmount(data) {
        let totalAmount = 0;
        //console.log(data);

        for (let i = 0; i < data.length; i++) {
            totalAmount += data[i].amount;
        }

        return parseFloat(totalAmount.toFixed(2));
    }

    return (
        <div style={{ display: 'flex' }}>
                <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead style={{backgroundColor: '#aaffaa' }}>
                        <tr>
                            <th style={styles.tableCell}>Date</th>
                            <th style={styles.tableCell}>Name</th>
                            <th style={styles.tableCell}>Amount</th>
                            <th style={styles.tableCell}>Description</th>
                            <th style={{...styles.tableCell, width: '4vw'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DashboardExpenseData.map((expense) => (
                            <tr key={expense.id}>
                                <td style={{ ...styles.tableCell, padding: '0px' }}>{expense.date}</td>
                                <td style={{ ...styles.tableCell, padding: '0px' }}>{expense.name}</td>
                                <td style={{ ...styles.tableCell, padding: '0px' }}>$ {expense.amount}</td>
                                <td style={{ ...styles.tableCell, padding: '0px' }}>{expense.description}</td>
                                <td style={{ ...styles.tableCell, padding: '0px', width: '4vw' }}>
                                    <button onClick={() => handleDeleteExpense(expense.id)} style={{ padding: '10px 20px', fontSize: '14px' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                            {/* Totals row */}
                            <tr>
                                <td style={styles.boldTableCell} colSpan={2}>Total</td>
                                <td style={{ ...styles.boldTableCell, textAlign: 'center' }}>$ {totalamount}</td>
                            </tr>
                    </tbody>
                    </table>
                </div>
            </div>
    );
};


const styles = {

    tableContainer: {
        maxHeight: '80vh',  
        //maxWidth: '60vw',  //max width
        overflowY: 'auto',  // Vertical scrollbar if content overflows
    },

    table: {
        border: '1px solid black',
        color: 'black',
        //maxWidth: '70vw',  // Adjust the width as needed
        borderCollapse: 'collapse',
        overflow: 'auto'
    },

    tableCell: {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'center',
        width: '20vw',
        maxWidth: '20vw',
        overflow: 'auto',  // Add this line for the cells
     
    },

    boldTableCell: {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'right',
        width: '20vw',
        maxWidth: '20vw',
        overflow: 'auto',  // Add this line for the cells
        fontWeight: 'bold',
    },
};

export default ExpensesTable;