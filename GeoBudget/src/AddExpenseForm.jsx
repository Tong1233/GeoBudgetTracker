import React, { useState } from 'react';

const AddExpenseForm = ({ onExpenseAdded }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [name, setname] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:5000/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, amount: parseFloat(amount), description }),
        })
            .then(response => response.json())
            .then(data => {
                onExpenseAdded();
                console.log(data);
            })
            .catch(error => console.error('Error adding expense:', error));
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '20vw' }}>

            <div style={{ marginBottom: '10px', width: '100%' }}>
                <label style={{ marginBottom: '5px', textAlign: 'left', width: '100%' }}>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                        placeholder="Required"
                        style={{ width: '100%', padding: '5px' }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: '10px', width: '100%' }}>
                <label style={{ marginBottom: '5px', textAlign: 'left', width: '100%' }}>
                    Amount:
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Required"
                        style={{width: '100%', padding: '5px' }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: '10px', width: '100%' }}>
                <label style={{ marginBottom: '5px', textAlign: 'left', width: '100%' }}>
                    Description:
                    <textarea
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optional"
                        rows="3"  
                        style={{ width: '100%', padding: '5px' }}
                    />
                </label>
            </div>

            <button type="submit" style={{ width: '50%', padding: '10px', margin: 'auto' }}>Add Expense</button>
        </form>
    );
};


export default AddExpenseForm;