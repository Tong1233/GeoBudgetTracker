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
            <div style={{ flex: 1, padding: '0px' }}>
                <h2>New Expense</h2>
                <AddExpenseForm onExpenseAdded={handleExpenseAdded} />
            </div>

            {/* Right side with expenses table */}
            <div style={{ flex: 2, marginRight: '20px' }}>
                <h2>Expenses</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Amount</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Description</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense.id}>
                                <td style={{ border: '1px solid black', padding: '0px', textAlign: 'center' }}>{expense.name}</td>
                                <td style={{ border: '1px solid black', padding: '0px', textAlign: 'center' }}>$ {expense.amount}</td>
                                <td style={{ border: '1px solid black', padding: '0px', textAlign: 'center' }}>{expense.description}</td>
                                <td style={{ border: '1px solid black', padding: '0px', textAlign: 'center', width: '4vw' }}>
                                    <button onClick={() => handleDeleteExpense(expense.id)} style={{ padding: '10px 20px', fontSize: '14px' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpensesComponent;