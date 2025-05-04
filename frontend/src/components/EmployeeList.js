import React, { useEffect, useState } from 'react';
import { getEmployees } from '../services/api';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        const data = await getEmployees();
        setEmployees(data);
    };

    return (
        <div>
            <h2>Employee List</h2>
            <ul>
                {employees.map(emp => (
                    <li key={emp.id}>{emp.gender} - {emp.designation} - ${emp.salary}</li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeList;
