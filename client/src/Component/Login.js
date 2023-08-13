// LoginComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {

            // Simulate a login by sending the token to the server for validation
            const token = localStorage.getItem(username); // Retrieve token from localStorage
            const secretKey = localStorage.getItem(`${username}_secretKey`);
            const response = await axios.post('http://localhost:5000/api/validate-token', { token , secretKey });
            console.log('response :', response);
            if (response.data.valid) {
                // Token is valid, navigate to the dashboard
                navigate('/dashboard' ,  { state: { userData: response.data.userData } });
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    useEffect(() => {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i); // Get the key of the current item
            const value = localStorage.getItem(key); // Get the value of the current item
            console.log(`Key: ${key}, Value: ${value}`);
        }
    }, [username])

    return (
        <div>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete='off'
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete='off'
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
