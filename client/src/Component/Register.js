// Register.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from "../modal/Navbar";


function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      // localStorage.clear();
      const response = await axios.post('http://localhost:5000/api/register', { username, password });
      const token = response.data.token;
      const secretKey = response.data.secretKey;
      if (token && secretKey) {
        localStorage.setItem(username, token);
        localStorage.setItem(`${username}_secretKey`, secretKey);
        navigate('/dashboard', { state: { userData: response.data.userData } });
      }
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i); // Get the key of the current item
        const value = localStorage.getItem(key); // Get the value of the current item
        console.log(`Key: ${key}, Value: ${value}`);
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div>


      <div className="min-h-full">
        <Navbar />
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">User Register </h1>
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

              <button onClick={handleRegister}>Register</button>
              <Link to="/login">Already have an account? Log in</Link>
            </div>

          </div>
        </main>
      </div>
    </div >
  );
}

export default Register;
