import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock } from 'lucide-react';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [status, setStatus] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/reset-password', {
                token: searchParams.get('token'),
                email: searchParams.get('email'),
                password: password,
                password_confirmation: passwordConfirm,
            });
            alert('Password berhasil diubah! Silakan login.');
            navigate('/login');
        } catch (err) {
            setStatus('Gagal merubah password. Token mungkin kadaluarsa.');
        }
    };

    return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-emerald-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
                <p className="text-gray-500 mt-2">Please enter your new password</p>
            </div>

            {status && (
                <div className="mb-5 p-4 bg-red-100 border border-red-200 text-red-700 text-sm rounded-xl">
                    {status}
                </div>
            )}

            <form onSubmit={handleReset} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                    </label>
                    <div className="relative">
                        <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                            placeholder="Minimal 8 karakter"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                            placeholder="Ulangi password"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition active:scale-[0.98]"
                >
                    Save New Password
                </button>
            </form>
        </div>
    </div>
);
}