import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            setUser(null);
            navigate('/login');
        }
    };

    return (
        <div style={{ padding: '50px' }}>
            <h1>Dashboard</h1>
            <p>Selamat datang, <strong>{user.name}</strong>!</p>
           
            
            <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px', background: 'red', color: 'white', border: 'none' }}>
                Logout
            </button>
        </div>
    );
}