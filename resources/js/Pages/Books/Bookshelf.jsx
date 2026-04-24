import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    RotateCw,
    Layers,
    FolderOpen,
    Search,
} from "lucide-react"; 

export default function Bookshelf({ user, setUser }) {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [bookshelves, setBookshelves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filteredBookshelves, setFilteredBookshelves] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    const fetchBookshelves = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get("/api/bookshelf");

            setBookshelves(response.data.data || response.data || []);
        } catch (error) {
            console.error("Error fetching bookshelf:", error);
            setError("Failed to load bookshelf. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = bookshelves.filter((bookshelf) =>
            `${bookshelf.name}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );
        setFilteredBookshelves(filtered);
    }, [search, bookshelves]); 

    useEffect(() => {
        fetchBookshelves();
    }, []);

    const handleBookshelfClick = (bookshelfData) => {
        const bookshelfName = bookshelfData.name || bookshelfData.bookshelf_name;
        navigate('/books', { state: { bookshelfFromNav: bookshelfName } });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                    Bookshelf
                </h2>

                <div className="flex items-center gap-5">
                    <div className="relative w-full md:w-80">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search bookshelves..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <button
                        onClick={fetchBookshelves}
                        className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-white font-medium hover:bg-green-700 transition w-fit"
                    >
                        <RotateCw size={18} />
                        Refresh
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 animate-pulse">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-200"></div>
                                <div className="w-12 h-6 rounded-full bg-slate-200"></div>
                            </div>
                            <div className="h-6 bg-slate-200 rounded-md w-1/2 mb-3"></div>
                            <div className="h-4 bg-slate-200 rounded-md w-full mb-2"></div>
                            <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-3xl p-6 shadow-sm">
                    {error}
                </div>
            ) : filteredBookshelves.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm flex flex-col items-center justify-center text-slate-500">
                    <FolderOpen size={42} className="mb-3 text-slate-400" />
                    <p className="text-lg font-medium">No bookshelves found</p>
                    <p className="text-sm text-slate-400 mt-1">
                        Looks like nobody has organized anything. Shocking.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredBookshelves.map((bookshelf, index) => (
                        <div
                            key={bookshelf.id || index}
                            onClick={() => handleBookshelfClick(bookshelf)}
                            className="cursor-pointer bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-lg hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1" // <-- Tambah cursor-pointer dan efek hover
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                                    <Layers className="text-green-700" size={24} />
                                </div>

                                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                                    #{bookshelf.id || index + 1}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-800 mb-2">
                                {bookshelf.name || bookshelf.bookshelf_name || "Unnamed Bookshelf"}
                            </h3>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}