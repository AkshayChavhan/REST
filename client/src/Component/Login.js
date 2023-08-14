// LoginComponent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "../modal/Navbar";

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {

            // Simulate a login by sending the token to the server for validation
            const token = localStorage.getItem(username); // Retrieve token from localStorage
            const secretKey = localStorage.getItem(`${username}_secretKey`);
            const response = await axios.post('http://localhost:5000/api/validate-token', { token, secretKey });
            console.log('response :', response);
            if (response.data.valid) {
                // Token is valid, navigate to the dashboard
                navigate('/dashboard', { state: { userData: response.data.userData } });
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
            <Navbar />
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Log in </h1>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <div style={{ display: 'flex', flexDirection: "column", width: '30vw' }}>
                        <label class="block">
                            <span class="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                                User-Name
                            </span>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete='off'
                                class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                            />
                        </label>
                        <label class="block">
                            <span class="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
                                Password
                            </span>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete='off'
                                class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                            />
                        </label>
                        <button onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
