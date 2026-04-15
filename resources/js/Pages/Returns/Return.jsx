import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    BookOpen,
    Search,
    CheckCircle2,
    Clock,
    XCircle,
    Info,
} from "lucide-react";

export default function Returns() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [filteredReturns, setFilteredReturns] = useState([]);

    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    useEffect(() => {
        const fetchReturns = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await axios.get("/api/return"); 
                const data = res.data.data || res.data || []; 
                
                setReturns(data);
                setFilteredReturns(data);
            } catch (err) {
                console.error("Error Fetching Returns:", err);
                
                const errorMessage = err.response?.data?.message || "Failed to fetch returns. Please check your connection or login status.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchReturns();
    }, []);

    useEffect(() => {
            let filtered = returns.filter((item) =>
            `${item.borrowing?.borrowings_book?.title || ""}` 
                .toLowerCase()
                .includes(search.toLowerCase())
        );

        if (activeTab !== "all") {
            filtered = filtered.filter((item) => item.status === activeTab);
        }

        setFilteredReturns(filtered);
    }, [search, returns, activeTab]);

    const stats = {
        pending: returns.filter((b) => b.status === "pending").length,
        accepted: returns.filter((b) => b.status === "accepted").length,
        rejected: returns.filter((b) => b.status === "rejected").length,
    };

    const getBadge = (status) => {
        switch (status) {
            case "accepted":
                return <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1 w-fit"><CheckCircle2 size={12} /> Accepted</span>;
            case "rejected":
                return <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 flex items-center gap-1 w-fit"><XCircle size={12} /> Rejected</span>;
            case "pending":
                return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-600 flex items-center gap-1 w-fit"><Clock size={12} /> Pending</span>;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                        My Returns
                    </h2>
                    <p className="text-slate-500 mt-1 text-sm">
                        View and monitor your book return requests
                    </p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search returned books..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
            </div>

            {/* Summary Stats */}
            {!loading && !error && (
                <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100">
                        <p className="text-xs text-yellow-600">Pending</p>
                        <p className="text-xl font-semibold text-yellow-700 mt-0.5">{stats.pending}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                        <p className="text-xs text-green-600">Accepted</p>
                        <p className="text-xl font-semibold text-green-700 mt-0.5">{stats.accepted}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <p className="text-xs text-slate-500">Rejected</p>
                        <p className="text-xl font-semibold text-slate-800 mt-0.5">{stats.rejected}</p>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 mb-5 flex-wrap">
                {[
                    { key: "all", label: "All History" },
                    { key: "pending", label: "Pending" },
                    { key: "accepted", label: "Accepted" },
                    { key: "rejected", label: "Rejected" },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-1.5 rounded-full text-sm border transition ${
                            activeTab === tab.key
                                ? "bg-green-600 text-white border-green-600"
                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Display */}
            {loading ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 animate-pulse flex gap-4">
                            <div className="w-14 h-20 bg-slate-200 rounded-lg flex-shrink-0" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="w-2/3 h-4 bg-slate-200 rounded" />
                                <div className="w-1/3 h-3 bg-slate-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm flex items-center gap-2">
                    <Info size={16} className="flex-shrink-0" /> 
                    <span>{error}</span>
                </div>
            ) : filteredReturns.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center">
                    <BookOpen className="mx-auto w-10 h-10 text-green-400 mb-3" />
                    <h3 className="text-lg font-semibold text-slate-800">No return records found</h3>
                    <p className="text-slate-400 mt-1 text-sm">You haven't requested any book returns yet, or try adjusting your search filter.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredReturns.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white w-full rounded-xl border border-slate-100 flex justify-between p-4 hover:shadow-sm transition"
                        >
                            <div className="flex gap-4 min-w-0">
                                <img
                                   
                                    src={`${apiUrl}/storage/${item.borrowing?.borrowings_book?.cover_image}`}
                                    alt={item.borrowing?.borrowings_book?.title}
                                    className="w-14 h-20 object-cover rounded-lg flex-shrink-0 bg-slate-100"
                                />
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-slate-800 truncate">
                                        {item.borrowing?.borrowings_book?.title || "Unknown Book"} 
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Qty: {item.quantity_returned}
                                    </p>
                                    <div className="mt-2">{getBadge(item.status)}</div>
                                    {item.notes && (
                                        <p className="text-[10px] text-slate-400 mt-2 italic bg-slate-50 p-1 px-2 rounded">
                                            "{item.notes}"
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-end justify-between ml-4 flex-shrink-0">
                                <div className="text-right">
                                    <p className="text-xs text-slate-400">Returned at</p>
                                    <p className="text-xs font-semibold mt-0.5 text-slate-700">
                                        {item.returned_at ? new Date(item.returned_at).toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        }) : "-"}
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                        {item.returned_at ? new Date(item.returned_at).toLocaleTimeString("en-GB", {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : ""}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}