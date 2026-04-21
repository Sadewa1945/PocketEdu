import React, { useState } from "react";
import axios from "axios";
import { X, Mail } from "lucide-react";

export default function ForgotPassword({ isOpen, onClose }) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await axios.post('/api/forgot-password', { email });
            setMessage('The password reset link has been sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Email not found.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition"
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-4">
                        <Mail size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Forgot Password?</h2>
                    <p className="text-gray-500 mt-2">Enter your email to receive a reset link</p>
                </div>

                {message && (
                    <div className="mb-5 p-4 bg-green-100 border border-green-200 text-green-700 text-sm rounded-xl">
                        {message}
                    </div>
                )}
                
                {error && (
                    <div className="mb-5 p-4 bg-red-100 border border-red-200 text-red-700 text-sm rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="email" 
                            placeholder="Enter your registered email"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button 
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-semibold text-white transition duration-200 ${
                            loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {loading ? 'Processing...' : 'Send Reset Link'}
                    </button>
                    
                    <button 
                        type="button"
                        onClick={onClose}
                        className="w-full text-center text-sm text-gray-500 hover:text-gray-700 font-medium transition"
                    >
                        Cancel and return to Login
                    </button>
                </form>
            </div>
        </div>
    );
}