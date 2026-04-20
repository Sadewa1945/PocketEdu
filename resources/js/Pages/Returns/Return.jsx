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
    Receipt
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

    const handlePayment = async (returnId) => {
        try {
            const response = await axios.post(`/api/payment/token/${returnId}`);
            const token = response.data.token;

            window.snap.pay(token, {
                onSuccess: function(result){
                    alert("Payment successful!");
                    window.location.reload();
                },
                onPending: function(result){
                    alert("Waiting for your payment!");
                },
                onError: function(result){
                    alert("Payment failed!")
                },
                onClose: function(result){
                    console.log('User closes popup without paying');
                }
            });
        } catch (err) {
            console.error("Payment error:", err);
            alert("Failed to initiate payment. Ensure the backend is running properly.")
        }
    };

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
                const errorMessage = err.response?.data?.message || "Failed to fetch returns.";
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

    // Helper untuk badge estetik di pojok gambar
    const getBadge = (status) => {
        switch (status) {
            case "accepted":
                return <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold border border-green-200 shadow-sm flex items-center gap-1"><CheckCircle2 size={10} /> Accepted</span>;
            case "rejected":
                return <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-bold border border-red-200 shadow-sm flex items-center gap-1"><XCircle size={10} /> Rejected</span>;
            case "pending":
                return <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-600 font-bold border border-yellow-200 shadow-sm flex items-center gap-1"><Clock size={10} /> Pending</span>;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">My Returns</h2>
                    <p className="text-slate-500 mt-1 text-sm">View and monitor your book return requests</p>
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

            <div className="flex gap-2 mb-8 flex-wrap">
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
                                ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-100"
                                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 animate-pulse">
                            <div className="aspect-[3/4] bg-slate-200 rounded-xl mb-4" />
                            <div className="h-4 bg-slate-200 rounded w-2/3 mb-2" />
                            <div className="h-3 bg-slate-200 rounded w-1/3" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm flex items-center gap-2">
                    <Info size={16} /> <span>{error}</span>
                </div>
            ) : filteredReturns.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center">
                    <BookOpen className="mx-auto w-10 h-10 text-green-400 mb-3" />
                    <h3 className="text-lg font-semibold text-slate-800">No return records found</h3>
                    <p className="text-slate-400 mt-1 text-sm">Adjust your filter or search keywords.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredReturns.map((item) => {
                        const fines = item.fines || [];
                        const totalFine = fines.reduce((sum, fine) => sum + Number(fine.amount), 0);
                        const isUnpaid = fines.some(fine => fine.status === 'unpaid');
                        const isRejected = item.status === 'rejected';

                        return (
                            <div
                                key={item.id}
                                className={`bg-white rounded-2xl border overflow-hidden flex flex-col transition shadow-sm hover:shadow-md ${
                                    isRejected ? "opacity-75 grayscale-[0.5] border-slate-100" : "border-slate-100"
                                }`}
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-[3/4] overflow-hidden bg-slate-50">
                                    <img
                                        src={`${apiUrl}/storage/${item.borrowing?.borrowings_book?.cover_image}`}
                                        alt={item.borrowing?.borrowings_book?.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                        {getBadge(item.status)}
                                    </div>
                                </div>

                                {/* Detail Content */}
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="font-bold text-slate-800 text-sm line-clamp-2 min-h-[25px]">
                                        {item.borrowing?.borrowings_book?.title || "Unknown Book"}
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-1 truncate">
                                        {item.borrowing?.borrowings_book?.publisher || "Unknown Publisher"}
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-1 truncate">
                                        {item.borrowing?.borrowings_book?.author || "Unknown Author"}
                                    </p>

                                    <div className="text-right">
                                            <p className="text-[10px] text-slate-400">Returned on</p>
                                            <p className="text-[11px] font-bold text-slate-700">
                                                {item.returned_at ? new Date(item.returned_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' }) : "-"}
                                            </p>
                                    </div>
                                    
                                    

                                    <div className="mt-4 pt-3 border-t border-slate-50 space-y-3">
                                        {/* Fines Area */}
                                        {totalFine > 0 && (
                                            <div className={`p-2 rounded-xl border flex flex-col gap-1 ${
                                                isUnpaid ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
                                            }`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <Receipt size={12} className={isUnpaid ? "text-red-500" : "text-green-500"} />
                                                        <span className={`text-[11px] font-bold ${isUnpaid ? "text-red-700" : "text-green-700"}`}>
                                                            Rp {totalFine.toLocaleString('id-ID')}
                                                        </span>
                                                    </div>
                                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                                                        isUnpaid ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700'
                                                    }`}>
                                                        {isUnpaid ? 'Unpaid' : 'Paid'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Notes */}
                                        {item.notes && (
                                            <p className="text-[10px] text-slate-400 italic bg-slate-50 p-2 rounded-lg line-clamp-2">
                                                "{item.notes}"
                                            </p>
                                        )}

                                        {/* Pay Button */}
                                        {isUnpaid && !isRejected && item.status !== 'pending' && (
                                            <button 
                                                onClick={() => handlePayment(item.id)}
                                                className="w-full py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-xl transition shadow-sm shadow-green-100"
                                            >
                                                Pay Fine
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