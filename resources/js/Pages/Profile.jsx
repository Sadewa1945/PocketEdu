import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
    LogOut,
    Menu,
    X,
    User,
    ChevronDown,
    Home,
    Book,
    RotateCw,
    Undo2,
    Layers,
    Loader2,
} from "lucide-react";

export default function Profile({ user, setUser }) {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [profile, setProfile] = useState(null);

    const appName = import.meta.env.VITE_APP_NAME || "PocketEdu";
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    const [editMode, setEditMode] = useState(false);
    const [save, setSave] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        image: null,
    });

    const [previewImage, setPreviewImage] = useState(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get("/api/user/profile");
            const userData = response.data.data;

            setProfile(userData);
            setUser(userData);

            setFormData({
                name: userData.name || "",
                image: null,
            });

            setPreviewImage(null);
        } catch (error) {
            console.error("Fetch profile error", error);
            setError("Failed to load profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            setUser(null);
            navigate("/login");
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "image" && files && files[0]) {
            const file = files[0];

            setFormData((prev) => ({ ...prev, image: file }));
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            setSave(true);
            setError("");

            const payload = new FormData();
            payload.append("name", formData.name);

            if (formData.image) {
                payload.append("image", formData.image);
            }

            payload.append("_method", "POST");

            const response = await axios.post("/api/user/profile", payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const updatedUser = response.data.data;

            setProfile(updatedUser);
            setUser(updatedUser);

            setEditMode(false);
            setFormData({
                name: updatedUser.name || "",
                image: null,
            });
            setPreviewImage(null);
        } catch (error) {
            console.error("Update profile error", error);

            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to update profile.");
            }
        } finally {
            setSave(false);
        }
    };

    const profileImage = profile?.image
        ? `${apiUrl}/storage/${profile.image}`
        : null;

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-white to-emerald-100">
            {/* Navbar */}
            <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                            {appName}
                        </h1>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-6 items-center relative">
                        <Link
                            to="/dashboard"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/books"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Books
                        </Link>

                        <Link
                            to="/borrowings"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Borrowings
                        </Link>

                        <Link
                            to="/returns"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Returns
                        </Link>

                        <Link
                            to="/categories"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Categories
                        </Link>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                            >
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                        <User
                                            size={20}
                                            className="text-slate-600"
                                        />
                                    </div>
                                )}

                                <span className="text-slate-700 font-medium max-w-[120px] truncate">
                                    {profile?.name || "User"}
                                </span>

                                <ChevronDown
                                    size={18}
                                    className={`text-slate-500 transition-transform duration-300 ${
                                        profileOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 mt-3 w-52 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="font-semibold text-slate-800">
                                            {profile?.name || "User"}
                                        </p>
                                        <p className="text-sm text-slate-500 truncate">
                                            {profile?.email || "No info"}
                                        </p>
                                    </div>

                                    <Link
                                        to="/profile"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-green-50 hover:text-green-700 transition"
                                    >
                                        <User size={18} />
                                        Profile
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Right Actions */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className={`p-2.5 rounded-2xl border transition-all duration-300 ${
                                menuOpen
                                    ? "bg-green-500 border-green-500 text-white shadow-md"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                            <div
                                className={`transition-transform duration-300 ${
                                    menuOpen ? "rotate-180" : "rotate-0"
                                }`}
                            >
                                {menuOpen ? (
                                    <X size={22} />
                                ) : (
                                    <Menu size={22} />
                                )}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        menuOpen
                            ? "max-h-[700px] opacity-100 translate-y-0 border-t border-slate-200"
                            : "max-h-0 opacity-0 -translate-y-2"
                    } bg-white`}
                >
                    <div className="px-4 py-4 space-y-4">
                        {/* Profile Card */}
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center border-2 border-white shadow-sm">
                                        <User
                                            size={24}
                                            className="text-green-700"
                                        />
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 truncate">
                                        {profile?.name || "User"}
                                    </p>
                                    <p className="text-sm text-slate-500 truncate">
                                        {profile?.email || "No info"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <Link
                                    to="/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                                >
                                    <User size={18} />
                                    Profile
                                </Link>

                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMenuOpen(false);
                                    }}
                                    className="flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-medium text-white hover:bg-red-600 transition"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
                            <p className="px-3 pt-2 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Navigation
                            </p>

                            <div className="space-y-1">
                                <Link
                                    to="/dashboard"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-green-700 transition"
                                >
                                    <Home size={20} />
                                    Dashboard
                                </Link>

                                <Link
                                    to="/books"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-green-700 transition"
                                >
                                    <Book size={20} />
                                    Books
                                </Link>

                                <Link
                                    to="/borrowings"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-green-700 transition"
                                >
                                    <RotateCw size={20} />
                                    Borrowings
                                </Link>

                                <Link
                                    to="/returns"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-green-700 transition"
                                >
                                    <Undo2 size={20} />
                                    Returns
                                </Link>

                                <Link
                                    to="/categories"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-green-700 transition"
                                >
                                    <Layers size={20} />
                                    Categories
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">
                    Profile
                </h2>

                {loading ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm flex flex-col items-center justify-center text-slate-500">
                        <Loader2 className="animate-spin mb-3" size={32} />
                        <p>Loading profile...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-3xl p-6 shadow-sm">
                        {error}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
                        {!editMode ? (
                            <>
                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                    <div className="relative group">
                                        {profileImage ? (
                                            <img
                                                src={profileImage}
                                                alt="Profile"
                                                className="w-28 h-28 rounded-full object-cover border-4 border-green-100 shadow"
                                            />
                                        ) : (
                                            <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-50 shadow">
                                                <User
                                                    size={42}
                                                    className="text-green-700"
                                                />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setEditMode(true)}
                                            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <User
                                                size={28}
                                                className="text-white"
                                            />
                                        </button>
                                    </div>

                                    <div className="flex-1 text-center sm:text-left">
                                        <div className="flex items-center gap-3 justify-center sm:justify-start">
                                            <div>
                                                <h3 className="text-2xl font-bold text-slate-800">
                                                    {profile?.name || "-"}
                                                </h3>
                                                <p className="text-slate-500 mt-1">
                                                    @{profile?.email || "-"}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    setEditMode(true)
                                                }
                                                className="p-2 rounded-lg hover:bg-green-50 text-green-700 transition"
                                                title="Edit profile"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                                                <p className="text-sm text-slate-500">
                                                    Nama
                                                </p>
                                                <p className="font-semibold text-slate-800 mt-1">
                                                    {profile?.name || "-"}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                                                <p className="text-sm text-slate-500">
                                                    Email
                                                </p>
                                                <p className="font-semibold text-slate-800 mt-1">
                                                    {profile?.email || "-"}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                                                <p className="text-sm text-slate-500">
                                                    Total Borrowings
                                                </p>
                                                <p className="font-semibold text-slate-800 mt-1 truncate">
                                                    {profile?.borrowings_user_count ||
                                                        0}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                                                <p className="text-sm text-slate-500">
                                                    Role
                                                </p>
                                                <p className="font-semibold text-slate-800 mt-1">
                                                    {profile?.role || "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <form
                                onSubmit={handleUpdateProfile}
                                className="space-y-6"
                            >
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4">
                                        {error}
                                    </div>
                                )}

                                {/* Image Upload */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative">
                                        {previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="w-32 h-32 rounded-full object-cover border-4 border-green-100 shadow"
                                            />
                                        ) : profileImage ? (
                                            <img
                                                src={profileImage}
                                                alt="Profile"
                                                className="w-32 h-32 rounded-full object-cover border-4 border-green-100 shadow"
                                            />
                                        ) : (
                                            <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-50 shadow">
                                                <User
                                                    size={48}
                                                    className="text-green-700"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <label className="px-6 py-3 bg-green-500 text-white rounded-2xl cursor-pointer hover:bg-green-600 transition font-medium">
                                        Change Photo
                                        <input
                                            type="file"
                                            name="image"
                                            onChange={handleChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                {/* Name Input */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Nama
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 justify-center sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditMode(false);
                                            setError("");
                                            setFormData({
                                                name: profile?.name || "",
                                                image: null,
                                            });
                                            setPreviewImage(null);
                                        }}
                                        className="px-6 py-3 border border-slate-300 text-slate-700 rounded-2xl hover:bg-slate-50 transition font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={save}
                                        className="px-6 py-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 disabled:bg-green-300 transition font-medium flex items-center gap-2"
                                    >
                                        {save ? (
                                            <>
                                                <Loader2
                                                    size={18}
                                                    className="animate-spin"
                                                />
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
