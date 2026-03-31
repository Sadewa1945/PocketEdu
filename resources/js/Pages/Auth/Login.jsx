import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login({ setUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await axios.get('/sanctum/csrf-cookie');
            
            const response = await axios.post('/api/login', { username, password });
           
            setUser(response.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal login.');
        }
    };

    return (
        <div style={{ padding: '50px' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
                <br /><br />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                <br /><br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}