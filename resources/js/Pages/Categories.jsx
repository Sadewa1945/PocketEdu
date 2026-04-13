import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    RotateCw,
    Layers,
    Loader2,
    FolderOpen,
} from "lucide-react";

export default function Category({ user, setUser }) {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get("/api/categories");

            setCategories(response.data.data || response.data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setError("Failed to load categories. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                        Categories
                    </h2>

                    <button
                        onClick={fetchCategories}
                        className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-white font-medium hover:bg-green-700 transition w-fit"
                    >
                        <RotateCw size={18} />
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm flex flex-col items-center justify-center text-slate-500">
                        <Loader2 className="animate-spin mb-3" size={32} />
                        <p>Loading categories...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-3xl p-6 shadow-sm">
                        {error}
                    </div>
                ) : categories.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm flex flex-col items-center justify-center text-slate-500">
                        <FolderOpen size={42} className="mb-3 text-slate-400" />
                        <p className="text-lg font-medium">No categories found</p>
                        <p className="text-sm text-slate-400 mt-1">
                            Looks like nobody has organized anything. Shocking.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {categories.map((category, index) => (
                            <div
                                key={category.id || index}
                                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                                        <Layers className="text-green-700" size={24} />
                                    </div>

                                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                                        #{category.id || index + 1}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 mb-2">
                                    {category.name || category.category_name || "Unnamed Category"}
                                </h3>

                                <p className="text-sm text-slate-500">
                                    {category.description || "No description available."}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
    );
}
