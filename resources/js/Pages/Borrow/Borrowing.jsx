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
            }else if (activeTab === "accepted") {
                filtered = filtered.filter((item) => item.status === "accepted");
            }else if (activeTab === "prepared") {
                filtered = filtered.filter((item) => item.status === "prepared");
            }else if (activeTab === "ready_to_pickup") {
                filtered = filtered.filter((item) => item.status === "ready_to_pickup");
            }else if (activeTab === "overdue") {
                filtered = filtered.filter((item) => item.status === "overdue");
            } else if (activeTab === "returned") {
                filtered = filtered.filter((item) => item.status === "returned");
            } else if (activeTab === "waiting_to_be_returned") {
                filtered = filtered.filter((item) => item.status === "waiting_to_be_returned");
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
    const isAccepted = (item) => item.status === "accepted";
    const isPrepared = (item) => item.status === "prepared";
    const isReadytoPickup = (item) => item.status === "ready_to_pickup";
    const isWaitingToBeReturned = (item) => item.status === "waiting_to_be_returned";

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
            case "waiting_to_be_returned":
                return <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Waiting to be Returned</span>;
            case "pending":
                return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-600">Pending</span>;
            case "prepared":
                return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-yellow-600">Prepared</span>;
            case "accepted":
                return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">Accepted</span>;
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
                        <p className="text-xs text-slate-500">Borrowed</p>
                        <p className="text-xl font-semibold text-slate-800 mt-0.5">{stats.borrowed}</p>
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
                    { key: "accepted", label: "Accepted" },
                    { key: "prepared", label: "Prepared" },
                    { key: "ready_to_pickup", label: "Ready to Pickup" },
                    { key: "borrowed", label: "Borrowed" },
                    { key: "overdue", label: "Overdue" },
                    { key: "returned", label: "Returned" },
                    { key: "waiting_to_be_returned", label: "Waiting to be Return" },
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 animate-pulse">
                            <div className="aspect-[3/4] bg-slate-200 rounded-xl mb-4" />
                            <div className="h-4 bg-slate-200 rounded w-2/3 mb-2" />
                            <div className="h-3 bg-slate-200 rounded w-1/3" />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredBorrowings.map((item) => {
                        const overdue = isOverdue(item);
                        const returned = isReturned(item);
                        const borrowed = isBorrowed(item);
                        const pending = isPending(item);
                        const accepted = isAccepted(item);
                        const prepare = isPrepared(item);
                        const ready_to_pickup = isReadytoPickup(item);
                        const waiting_to_be_returned = isWaitingToBeReturned(item);

                        return (
                            <div
                                key={item.id}
                                className={`bg-white rounded-2xl border overflow-hidden flex flex-col transition shadow-sm hover:shadow-md ${
                                    returned ? "opacity-75 grayscale-[0.5] border-slate-100" : overdue ? "border-red-200" : "border-slate-100"
                                }`}
                            >
                                <div className="relative aspect-[3/4] overflow-hidden bg-slate-50">
                                    <img
                                        src={
                                            item.borrowings_book?.cover_image
                                                ? `${apiUrl}/storage/${item.borrowings_book.cover_image}`
                                                : "/images/pocketedu.png"
                                        }
                                        alt={item.borrowings_book?.title || "Book Cover"}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.src = "/images/pocketedu.png"; 
                                        }}
                                    />
                                    <div className="absolute top-2 right-2">
                                        {getBadge(item)}
                                    </div>
                                </div>

                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="font-bold text-slate-800 text-sm line-clamp-2 min-h-[25px]">
                                        {item.borrowings_book?.title}
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-1 truncate">
                                        {item.borrowings_book?.publisher}
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-1 truncate">
                                        {item.borrowings_book?.author}
                                    </p>

                                    <div className="mt-4 pt-3 border-t border-slate-50 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Due Date</span>
                                            <span className={`text-[11px] font-bold ${overdue ? "text-red-500" : "text-slate-700"}`}>
                                                {new Date(item.due_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                                            </span>
                                        </div>

                                        {(borrowed || overdue) && (
                                            <div className={`text-center py-1.5 rounded-lg text-[10px] font-bold ${overdue ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
                                                {getCountdown(item.due_at)}
                                            </div>
                                        )}

                                        {(borrowed || overdue) && (
                                            <button
                                                onClick={() => navigate(`/borrowing/${item.id}/returns`)}
                                                className="w-full py-2 rounded-xl bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition flex items-center justify-center gap-2"
                                            >
                                                <RotateCcw size={14} /> Return
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}