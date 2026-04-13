import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    BookOpen,
    Search,
} from "lucide-react";

export default function Borrowing({ user, setUser }) {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [borrowings, setBorrowings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [now, setNow] = useState(new Date());

    const [filteredBorrowings, setFilteredBorrowings] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    

        useEffect(() => {
            const interval = setInterval(() => {
                setNow(new Date());
            }, 1000);

            return () => clearInterval(interval);
        }, []);

        useEffect(() => {
        const filtered = borrowings.filter((item) =>
            `${item.borrowings_book?.title || ""}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );

        setFilteredBorrowings(filtered);
    }, [search, borrowings]);

        useEffect(() => {
        const fetchBorrowings = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await axios.get("/api/borrowing");
                setBorrowings(res.data.data);
                setFilteredBorrowings(res.data.data);

            } catch (err) {
                console.error(err);
                setError("Failed to fetch borrowings");

            } finally {
            setLoading(false);
            }
        };

        fetchBorrowings();
    }, []);

        const getCountdown = (dueDate) => {
        const due = new Date(dueDate);
        const diff = due - now;

        if (diff <= 0) return "Overdue";

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                            Borrowings
                        </h2>
                        <p className="text-slate-500 mt-2">
                           Explore Your Borrowing History
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-80">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            placeholder="Search books..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-white p-4 rounded-xl shadow animate-pulse flex justify-between">
                                <div className="flex gap-4">
                                    <div className="w-16 h-20 bg-slate-200 rounded"></div>
                                    <div className="space-y-2">
                                        <div className="w-40 h-4 bg-slate-200 rounded"></div>
                                        <div className="w-24 h-3 bg-slate-200 rounded"></div>
                                    </div>
                                </div>
                                <div className="w-20 h-8 bg-slate-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="bg-red-100 border border-red-200 text-red-700 px-5 py-4 rounded-2xl">
                        {error}
                    </div>
                )}

                {!loading && !error && filteredBorrowings.length === 0 && (
                    <div className="bg-white border border-green-100 shadow-sm rounded-3xl p-10 text-center">
                        <BookOpen className="mx-auto w-12 h-12 text-green-500 mb-4" />
                            <h3 className="text-xl font-bold text-slate-800">
                                No borrows found
                            </h3>
                            <p className="text-slate-500 mt-2">
                                Try searching with another keyword.
                            </p>
                    </div>
                )}

                {!loading && !error && filteredBorrowings.length > 0 && (
                    filteredBorrowings.map((item) => (
                        <div key={item.id} className="bg-white w-full rounded-md flex justify-between p-4 mb-4 shadow">
                                    <div className="flex gap-4">
                                        <img
                                            src={`${apiUrl}/storage/${item.borrowings_book?.cover_image}`}
                                            alt=""
                                            className="w-16 h-20 object-cover rounded"
                                        />
                                        <div>
                                            <h1 className="font-semibold text-lg">
                                                {item.borrowings_book?.title}
                                            </h1>
                                            <p className="text-sm text-slate-500">
                                                Due: {item.due_at}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                Status: {item.status}
                                            </p>
                                            <p
                                                className={`text-xs font-medium ${
                                                    getCountdown(item.due_at) === "Overdue"
                                                        ? "text-red-500"
                                                        : "text-blue-500"
                                                }`}
                                            >
                                                {getCountdown(item.due_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <button className="h-fit px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition">
                                        Return
                                    </button>
                                    </div>
                                    
                                </div>
                    ))
                )}
                

                
            </div>
    );
}