import './bootstrap';
import '../css/app.css';

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen } from 'lucide-react';

import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import Dashboard from './Pages/Dashboard';
import BooksOverview from './Pages/BooksOverview';
import Profile from './Pages/Profile';
import Category from './Pages/Categories';
import BooksDetail from './Pages/BooksDetail';

// Axios config penting untuk Sanctum
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

function AppLoader() {
    const appName = import.meta.env.VITE_APP_NAME || 'PocketEdu';

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-emerald-100 flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white/80 backdrop-blur-md border border-green-100 shadow-xl rounded-3xl px-8 py-10 text-center">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center shadow-inner">
                            <BookOpen className="w-8 h-8 text-green-600" />
                        </div>

                        <div className="absolute -inset-2 rounded-3xl border-4 border-green-200 border-t-green-500 animate-spin"></div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-800">{appName}</h2>
                <p className="text-slate-500 mt-2 text-sm sm:text-base">
                    Loading your library experience...
                </p>

                <div className="mt-6 w-full h-2 bg-green-100 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}

function ProtectedRoute({ user, children }) {
    if (user === undefined) {
        return <AppLoader />;
    }

    return user ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ user, children }) {
    if (user === undefined) {
        return <AppLoader />;
    }

    return !user ? children : <Navigate to="/dashboard" replace />;
}

function App() {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        const checkUser = async () => {
            try {
                await axios.get('/sanctum/csrf-cookie');
                const response = await axios.get('/api/user');
                setUser(response.data);
            } catch (error) {
                setUser(null);
            }
        };

        checkUser();
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <GuestRoute user={user}>
                            <Login setUser={setUser} />
                        </GuestRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <GuestRoute user={user}>
                            <Register setUser={setUser} />
                        </GuestRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute user={user}>
                            <Dashboard user={user} setUser={setUser} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/books"
                    element={
                        <ProtectedRoute user={user}>
                            <BooksOverview user={user} setUser={setUser} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/books/:id"
                    element={
                        <ProtectedRoute user={user}>
                            <BooksDetail user={user} setUser={setUser} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/user/profile"
                    element={
                        <ProtectedRoute user={user}>
                            <Profile user={user} setUser={setUser} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/categories"
                    element={
                        <ProtectedRoute user={user}>
                            <Category user={user} setUser={setUser} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/"
                    element={
                        user === undefined ? (
                            <AppLoader />
                        ) : (
                            <Navigate to={user ? '/dashboard' : '/login'} replace />
                        )
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

const rootElement = document.getElementById('react-app');

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}