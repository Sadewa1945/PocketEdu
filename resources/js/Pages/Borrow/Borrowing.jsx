import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    BookOpen,
    Search,
    RotateCcw,
    RefreshCw,
} from "lucide-react";

export default function Borrowing() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [borrowings, setBorrowings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("all");
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
            let filtered = borrowings.filter((item) =>
                `${item.borrowings_book?.title || ""}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );

            if (activeTab === "borrowed") {
                filtered = filtered.filter((item) => item.status === "borrowed");
            }else if (activeTab === "pending") {
                filtered = filtered.filter((item) => item.status === "pending");
            }else if (activeTab === "prepared") {
                filtered = filtered.filter((item) => item.status === "prepared");
            }else if (activeTab === "ready_to_pickup") {
                filtered = filtered.filter((item) => item.status === "ready_to_pickup");
            }else if (activeTab === "overdue") {
                filtered = filtered.filter((item) => item.status === "overdue");
            } else if (activeTab === "returned") {
                filtered = filtered.filter((item) => item.status === "returned");
            }

            setFilteredBorrowings(filtered);
        }, [search, borrowings, activeTab]);

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

    const isOverdue = (item) => item.status === "overdue";
    const isReturned = (item) => item.status === "returned";
    const isBorrowed = (item) => item.status === "borrowed";
    const isPending = (item) => item.status === "pending";
    const isPrepared = (item) => item.status === "prepared";
    const isReadytoPickup = (item) => item.status === "ready_to_pickup";

    const stats = {
        borrowed: borrowings.filter((b) => b.status === "borrowed").length,
        overdue: borrowings.filter((b) => b.status === "overdue").length,
        returned: borrowings.filter((b) => b.status === "returned").length,
    };

    const getBadge = (item) => {
        switch (item.status) {
            case "borrowed":
                return <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Borrowed</span>;
            case "overdue":
                return <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">Overdue</span>;
            case "returned":
                return <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Returned</span>;
            case "pending":
                return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-600">Pending</span>;
            case "prepared":
                return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">Prepared</span>;
            case "ready_to_pickup":
                return <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">Ready to Pick Up</span>;
            default:
                return null;
        }
    };

        return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                        Borrowings
                    </h2>
                    <p className="text-slate-500 mt-1 text-sm">
                        Track and manage your borrowed books
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
            </div>

            {/* Summary Stats */}
            {!loading && !error && (
                <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-500">Active</p>
                        <p className="text-xl font-semibold text-slate-800 mt-0.5">{stats.active}</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-3">
                        <p className="text-xs text-red-400">Overdue</p>
                        <p className="text-xl font-semibold text-red-600 mt-0.5">{stats.overdue}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                        <p className="text-xs text-slate-500">Returned</p>
                        <p className="text-xl font-semibold text-slate-800 mt-0.5">{stats.returned}</p>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-5 flex-wrap">
                {[
                    { key: "all", label: "All" },
                    { key: "pending", label: "Pending" },
                    { key: "prepared", label: "Prepared" },
                    { key: "ready_to_pickup", label: "Ready to Pickup" },
                    { key: "borrowed", label: "Borrowed" },
                    { key: "overdue", label: "Overdue" },
                    { key: "returned", label: "Returned" },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-1.5 rounded-full text-sm border transition ${
                            activeTab === tab.key
                                ? "bg-green-500 text-white border-green-500"
                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 animate-pulse flex gap-4">
                            <div className="w-14 h-20 bg-slate-200 rounded-lg flex-shrink-0" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="w-2/3 h-4 bg-slate-200 rounded" />
                                <div className="w-1/3 h-3 bg-slate-200 rounded" />
                                <div className="w-1/4 h-3 bg-slate-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm">
                    {error}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredBorrowings.length === 0 && (
                <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center">
                    <BookOpen className="mx-auto w-10 h-10 text-green-400 mb-3" />
                    <h3 className="text-lg font-semibold text-slate-800">No borrowings found</h3>
                    <p className="text-slate-400 mt-1 text-sm">Try a different keyword or adjust the filter.</p>
                </div>
            )}

            {/* List */}
            {!loading && !error && filteredBorrowings.length > 0 && (
                <div className="space-y-3">
                    {filteredBorrowings.map((item) => {
                        const overdue = isOverdue(item);
                        const returned = isReturned(item);
                        const borrowed = isBorrowed(item);

                        return (
                            <div
                                key={item.id}
                                className={`bg-white w-full rounded-xl border flex justify-between p-4 transition ${
                                    returned
                                        ? "opacity-60 border-slate-100"
                                        : overdue
                                        ? "border-red-200"
                                        : "border-slate-100 hover:border-slate-200"
                                }`}
                            >
                                <div className="flex gap-4 min-w-0">
                                    <img
                                        src={`${apiUrl}/storage/${item.borrowings_book?.cover_image}`}
                                        alt={item.borrowings_book?.title}
                                        className="w-14 h-20 object-cover rounded-lg flex-shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-slate-800 truncate">
                                            {item.borrowings_book?.title}
                                        </h3>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {item.borrowings_book?.author}
                                        </p>
                                        <div className="mt-2">{getBadge(item)}</div>
                                        {(borrowed || overdue) && (
                                            <p className={`text-xs mt-1 font-medium ${overdue ? "text-red-500" : "text-blue-500"}`}>
                                                {getCountdown(item.due_at)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-between ml-4 flex-shrink-0">
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400">Due date</p>
                                        <p className={`text-xs font-semibold mt-0.5 ${overdue ? "text-red-500" : "text-slate-700"}`}>
                                            {new Date(item.due_at).toLocaleDateString("en-US", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    {(borrowed || overdue) && (
                                        <div className="flex flex-col gap-1.5 mt-3">
                                            <button className="px-4 py-1.5 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition flex items-center gap-1.5">
                                                <RotateCcw size={12} /> Return
                                            </button>
                                            {borrowed && (
                                                <button className="px-4 py-1.5 rounded-lg border border-blue-400 text-blue-500 text-xs font-medium hover:bg-blue-50 transition flex items-center gap-1.5">
                                                    <RefreshCw size={12} /> Renew
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}