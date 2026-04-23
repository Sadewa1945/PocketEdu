import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import {
    User,
    Loader2,
} from "lucide-react";

export default function Profile() {
    const { user, setUser } = useOutletContext();
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [profile, setProfile] = useState(null);
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
    );
}
