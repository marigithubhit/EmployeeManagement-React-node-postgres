import React, { useState } from 'react';
import { addEmployee } from '../services/api';

const AddEmployee = () => {
    const [employee, setEmployee] = useState({ name: '', email: '', position: '', salary: '' });

    const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addEmployee(employee);
        alert('Employee Added');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="text" name="position" placeholder="Position" onChange={handleChange} required />
            <input type="number" name="salary" placeholder="Salary" onChange={handleChange} required />
            <button type="submit">Add Employee</button>
        </form>
    );
};

export default AddEmployee;
