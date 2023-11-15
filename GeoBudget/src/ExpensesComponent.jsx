import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddExpenseForm from './AddExpenseForm';

const ExpensesComponent = () => {
    const [expenses, setExpenses] = useState([]);

    const handleExpenseAdded = () => {
        fetchExpenses();
    };

    const handleDeleteExpense = async (expenseId) => {
        try {
            // Send a DELETE request to delete the expense by ID
            await axios.delete(`http://localhost:5000/expenses/${expenseId}`);
            // Fetch updated expenses after deletion
            fetchExpenses();
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const fetchExpenses = () => {
        fetch('http://localhost:5000/expenses')
            .then(response => response.json())
            .then(data => setExpenses(data))
            .catch(error => console.error('Error fetching expenses:', error));
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    return (
        <div style={{ display: 'flex' }}>
            {/* Left side with input form */}
            <div style={{ flex: 1}}>
                <h2>New Expense</h2>
                <AddExpenseForm onExpenseAdded={handleExpenseAdded} />
            </div>

            {/* Right side with expenses table */}
            <div style={{ flex: 2, marginRight: '20px'}}>
                <h2>Expenses</h2>
                <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.tableCell}>Date</th>
                            <th style={styles.tableCell}>Name</th>
                            <th style={styles.tableCell}>Amount</th>
                            <th style={styles.tableCell}>Description</th>
                            <th style={{...styles.tableCell, width: '4vw'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense) => (
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
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Add this style section within your component file
const styles = {

    tableContainer: {
        maxHeight: '80vh',  // Adjust the maximum height as needed
        //maxWidth: '60vw',  //max width
        overflowY: 'auto',  // Vertical scrollbar if content overflows
    },

    // Add this new style for the table
    table: {
        border: '1px solid black',
        //maxWidth: '70vw',  // Adjust the width as needed
        borderCollapse: 'collapse',
        overflow: 'auto'
    },

    // Add this new style for the table cells
    tableCell: {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'center',
        width: '20vw',
        maxWidth: '20vw',
        overflow: 'auto',  // Add this line for the cells
     
    },
};

export default ExpensesComponent;