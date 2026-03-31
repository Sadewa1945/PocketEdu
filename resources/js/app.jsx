import './bootstrap'; // Pastikan bootstrap.js sudah ada withCredentials = true
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Import Halaman
import Login from './Pages/Auth/Login';
import Dashboard from './Pages/Dashboard';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await axios.get('/api/user');
                setUser(response.data);
            } catch (error) {
                setUser(null); 
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    if (loading) {
        return <div style={{ padding: '50px', textAlign: 'center' }}>Memuat Aplikasi...</div>;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route 
                    path="/login" 
                    element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" replace />} 
                />

                <Route 
                    path="/dashboard" 
                    element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" replace />} 
                />

                <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
            </Routes>
        </BrowserRouter>
    );
}

const rootElement = document.getElementById('react-app');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
}