import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Lock, Eye, EyeOff, BookOpen } from 'lucide-react';

export default function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();
    const appName = import.meta.env.VITE_APP_NAME || 'PocketEdu';
    const [remember, setRemember] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.get('/sanctum/csrf-cookie');

            const response = await axios.post('/api/login', {
                email,
                password,
                remember
            });

            setUser(response.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-emerald-100 flex items-center justify-center px-4 py-8">
            <div className="w-full h-[41rem] max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                
                
                <div className="relative hidden md:block">
                    <img
                        src="/images/image.jpg"
                        alt="PocketEdu Illustration"
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-8 text-white">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm">
                                 <BookOpen size={24} />
                            </div>
                                <h1 className="text-2xl lg:text-3xl font-bold">{appName}</h1>
                            </div>
                                <p className="text-sm lg:text-base text-white/90 max-w-sm leading-relaxed">
                                    Learning becomes easier, structured, and convenient in one platform.
                                </p>
                            </div>
                </div>

                
                <div className="flex items-center justify-center p-8 md:p-12">
                    <div className="w-full max-w-md">
                        <div className="md:hidden text-center mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-100 text-green-700 mb-4">
                                <BookOpen size={28} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800">{appName}</h2>
                            <p className="text-gray-500 mt-2">Please login to continue</p>
                        </div>

                        <div className="hidden md:block mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 text-center">Welcome</h2>
                            <p className="text-gray-500 mt-2 text-center">Please login to continue</p>
                        </div>

                        {error && (
                            <div className="mb-5 p-4 bg-red-100 border border-red-200 text-red-700 text-sm rounded-xl">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <User
                                        size={20}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        size={20}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="hide-password-toggle w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 text-sm flex-wrap">
                                <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                                    <input 
                                        type="checkbox" 
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <span className="whitespace-nowrap">Remember me</span>
                                </label>

                                <a 
                                    href="#" 
                                    className="text-green-600 hover:text-green-700 font-medium transition whitespace-nowrap"
                                >
                                    Forgot password?
                                </a>

                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 rounded-xl font-semibold text-white transition duration-200 ${
                                    loading
                                        ? 'bg-green-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 active:scale-[0.98]'
                                }`}
                            >
                                {loading ? 'process...' : 'Login'}
                            </button>
                        </form>
                        <p className="text-center text-sm text-gray-500 mt-8">
                            Don't have an account? {' '}
                            <a href="/register" className="text-green-600 hover:text-green-700 font-medium">
                                Register here
                            </a>
                        </p>

                        <p className="text-center text-sm text-gray-500 mt-8">
                            © {currentYear} {appName}. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}