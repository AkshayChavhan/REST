// Register.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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
      if(token && secretKey){
        localStorage.setItem(username, token);
        localStorage.setItem(`${username}_secretKey`, secretKey);
        navigate('/dashboard' ,  { state: { userData: response.data.userData } });
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
      <div style={{ display: 'flex', flexDirection: "column", width: '30vw' }}>
        <h2>Register</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleRegister}>Register</button>
        <Link to="/login">Already have an account? Log in</Link>
      </div>
    </div >
  );
}

export default Register;
