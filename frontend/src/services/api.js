import axios from 'axios';

const API_URL = 'http://localhost:5001';

export const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data; 
};
export const getEmployees = async () => {
    const response = await axios.get(`${API_URL}/employees`);
    return response.data;
};

export const addEmployee = async (employee) => {
    const response = await axios.post(`${API_URL}/employees`, employee);
    return response.data;
};
