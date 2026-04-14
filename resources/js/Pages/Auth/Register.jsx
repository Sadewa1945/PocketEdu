import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    User,
    Lock,
    Eye,
    EyeOff,
    BookOpen,
    CheckCircle2,
    X,
} from "lucide-react";

export default function Register({ setUser }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();
    const appName = import.meta.env.VITE_APP_NAME || "PocketEdu";

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await axios.get("/sanctum/csrf-cookie");

            const response = await axios.post("/api/register", {
                name,
                email,
                password,
                password_confirmation: confirmPassword,
            });

            setUser(response.data.user);
            setShowSuccessPopup(true);
        } catch (err) {
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                const firstError = Object.values(errors)[0][0];
                setError(firstError);
            } else {
                setError(err.response?.data?.message || "Gagal register.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClosePopup = () => {
        setIsRedirecting(true);
        setTimeout(() => {
            setShowSuccessPopup(false);
            navigate("/dashboard");
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-emerald-100 flex items-center justify-center px-4 py-6 md:py-8">
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[680px] md:min-h-[620px]">
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
                            <h1 className="text-2xl lg:text-3xl font-bold">
                                {appName}
                            </h1>
                        </div>
                        <p className="text-sm lg:text-base text-white/90 max-w-sm leading-relaxed">
                            Learning becomes easier, structured, and convenient
                            in one platform.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center px-6 py-8 md:px-8 md:py-6 lg:px-10">
                    <div className="w-full max-w-md">
                        <div className="md:hidden text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-green-100 text-green-700 mb-3">
                                <BookOpen size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {appName}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Please register to continue
                            </p>
                        </div>

                        <div className="hidden md:block mb-6">
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 text-center">
                                Create Account
                            </h2>
                            <p className="text-sm text-gray-500 mt-2 text-center">
                                Please register to continue
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded-xl">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Name
                                </label>
                                <div className="relative">
                                    <User
                                        size={18}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-sm"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email
                                </label>
                                <div className="relative">
                                    <User
                                        size={18}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-sm"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-sm"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-sm"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        placeholder="Confirm your password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword,
                                            )
                                        }
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs md:text-sm pt-1">
                                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <span>I accept the terms of the agreement</span>
                                </label>

                               
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-2.5 md:py-3 rounded-xl font-semibold text-white text-sm transition duration-200 ${
                                    loading
                                        ? "bg-green-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700 active:scale-[0.98]"
                                }`}
                            >
                                {loading ? "Memproses..." : "Register"}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-8">
                            already have an account?{" "}
                            <a
                                href="/login"
                                className="text-green-600 hover:text-green-700 font-medium"
                            >
                                Login here
                            </a>
                        </p>

                        <p className="text-center text-xs md:text-sm text-gray-500 mt-6">
                            © {currentYear} {appName}. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

            {showSuccessPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-[fadeIn_.25s_ease-out]">
                        <button
                            onClick={handleClosePopup}
                            disabled={isRedirecting}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div
                                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full transition ${
                                    isRedirecting
                                        ? "bg-green-600 text-white"
                                        : "bg-green-100 text-green-600"
                                }`}
                            >
                                {isRedirecting ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <CheckCircle2 size={34} />
                                )}
                            </div>

                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                {isRedirecting
                                    ? "Redirecting..."
                                    : "Register Successful!"}
                            </h3>

                            <p className="text-sm text-gray-500 leading-relaxed mb-6">
                                {isRedirecting
                                    ? "Taking you to your dashboard..."
                                    : `Your account has been created successfully. You can now log in and start using ${appName}.`}
                            </p>

                            <button
                                onClick={handleClosePopup}
                                disabled={isRedirecting}
                                className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition active:scale-[0.98] ${
                                    isRedirecting
                                        ? "bg-green-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                            >
                                {isRedirecting
                                    ? "Loading..."
                                    : "Continue to Dashboard"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
