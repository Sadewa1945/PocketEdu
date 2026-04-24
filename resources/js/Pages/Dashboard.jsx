import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import {
    BookOpen,
    Library,
    ClipboardList,
    AlertCircle,
    CircleDollarSign,
    BookHeart
} from "lucide-react";

export default function Dashboard({ user, setUser }) {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [borrowingsCount, setBorrowingsCount] = useState(0);
    const [overdueCount, setOverdueCount] = useState(0);
    const [fineAmount, setFineAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                await Promise.all([
                    fetchBooks(),
                    fetchBorrowingsCount(),
                    fetchOverdueCount(),
                    fetchFineAmount(),
                ]);
            } catch (err) {
                console.error("Gagal mengambil data dashboard:", err);
                setError("Gagal memuat data dashboard.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const { wishlist, setWishlist } = useOutletContext();

    const handleAddToWishlist = (book) => {
        if (wishlist.some(item => item.id === book.id)) {
            alert("The book is already on the wishlist!");
            return;
        }
        setWishlist([...wishlist, book]);
    };

    const fetchBooks = async () => {
        try {
            const res = await axios.get("/api/books");
            const bookData = Array.isArray(res.data)
                ? res.data
                : res.data.data || [];
            setBooks(bookData);
        } catch (err) {
            console.error("Fetch books error", err);
        }
    };

    const fetchBorrowingsCount = async () => {
        try {
            const res = await axios.get("/api/borrowings/count");
            setBorrowingsCount(res.data.data || 0);
        } catch (err) {
            console.error("Fetch borrowings count error", err);
        }
    };

    const fetchOverdueCount = async () => {
        try {
            const res = await axios.get("/api/borrowings/overdue/count");
            setOverdueCount(res.data.data || 0);
        } catch (err) {
            console.error("Fetch overdue count error", err);
        }
    };

    const fetchFineAmount = async () => {
        try {
            const res = await axios.get("/api/fines/stats");
            console.log("Response Fine API:", res.data);

            let amount = res.data?.data !== undefined ? res.data.data : res.data;
            
            setFineAmount(Number(amount) || 0); 
        } catch (err) {
            console.error("Fetch fine amount count error", err);
            setFineAmount(0); 
        }
    };

    const latestBooks = [...books].slice(-4).reverse();
    const allBooks = [...books].slice(0, 20).reverse();

    const stats = [
        {
            title: "Total Borrowed",
            value: borrowingsCount,
            valueColor: "text-green-500", 
            icon: <BookOpen size={28} className="text-green-500 animate-pulse" />,
        },
        {
            title: "Overdue",
            value: overdueCount,
            valueColor: "text-red-500", 
            icon: <AlertCircle size={28} className="text-red-500 animate-pulse"  />,
        },
        {
            title: "Fine Amount",
            value: `Rp ${Number(fineAmount).toLocaleString("id-ID")}`,
            valueColor: "text-red-500", 
            icon: <CircleDollarSign size={28} className="text-red-500 animate-pulse" />,
        },
        
    ];

    return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">
                    Dashboard
                </h2>

                {loading && (
                    <div className="animate-pulse">

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-green-100">
                                    <div className="flex items-center justify-between">
                                        <div className="w-full">
                                            <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                                            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                                        </div>
                                        <div className="w-10 h-10 bg-slate-200 rounded-full shrink-0"></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <div className="h-8 bg-slate-200 rounded w-48 mb-6"></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="gap-5 bg-white p-5 rounded-2xl border border-green-100 shadow-sm flex flex-col h-full">
                                        <div className="w-full h-56 bg-slate-200 rounded-xl mb-4"></div>
                                        <div className="flex-1 flex flex-col">
                                            <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
                                            <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                                            <div className="h-4 bg-slate-200 rounded w-2/3 mb-5"></div>
                                        </div>
                                        <div className="mt-auto w-full h-10 rounded-xl bg-slate-200"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {stats.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-green-100 hover:shadow-md transition duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-500 text-sm">
                                            {item.title}
                                        </p>
                                        <h3 className={`text-2xl sm:text-3xl mt-4 font-bold ${item.valueColor}`}>
                                            {item.value}
                                        </h3>
                                    </div>
                                    <div className="shrink-0">{item.icon}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && books.length > 0 && (
                    <div className="mt-10">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-5">
                            Latest Books
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                            {latestBooks.map((book) => (
                                <div
                                    key={book.id}
                                    className="gap-5 bg-white p-5 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition duration-300 flex flex-col h-full"
                                >
                                    <div className="w-full h-56 bg-slate-100 overflow-hidden rounded-xl mb-4">
                                        <img
                                            src={
                                                book.cover_image
                                                    ? `${apiUrl}/storage/${book.cover_image}`
                                                    : "/images/pocketedu.png"
                                            }
                                            alt={book.title}
                                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/images/pocketedu.png";
                                            }}
                                        />
                                    </div>
                                    
                                    <div className="flex-1 flex flex-col">
                                        <h4 
                                            className="text-lg font-bold text-slate-800 line-clamp-2"
                                            title={book.title}
                                        >
                                            {book.title}
                                        </h4>
                                        <p className="text-slate-500 mt-2 text-sm">
                                            {book.author}
                                        </p>
                                        <p className="text-slate-400 text-sm mt-1">
                                            {book.publisher}
                                        </p>
                                    </div>

                                    {book.stock > 0 ? (
                                        <div className="mt-auto flex gap-2">
                                            <button 
                                                onClick={() => handleAddToWishlist(book)} 
                                                className="flex-1 py-2 flex justify-center items-center gap-2 rounded-xl bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors duration-300 font-semibold text-sm"
                                            >
                                                <BookHeart size={16} /> Wishlist
                                            </button>
                                            <button 
                                                onClick={() => navigate(`/books/${book.id}`)} 
                                                className="flex-1 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors duration-300 font-semibold text-sm"
                                            >
                                                View
                                            </button>
                                        </div>
                                    ):(
                                        <button 
                                            disabled
                                            className="mt-auto w-full py-2 rounded-xl bg-slate-300 text-slate-500 cursor-not-allowed transition-colors duration-300 font-medium"
                                        >
                                        Out of Stock
                                    </button>
                                    )}

                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!loading && books.length > 0 && (
                    <div className="mt-10">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
                                All Books
                            </h3>

                            <button
                                onClick={() => navigate("/books")}
                                className="text-green-600 hover:text-green-700 font-medium text-sm sm:text-base transition"
                            >
                                See All
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                            {allBooks.map((book) => (
                                <div
                                    key={book.id}
                                    className="gap-5 bg-white p-5 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition duration-300 flex flex-col h-full"
                                >
                                    <div className="w-full h-56 bg-slate-100 overflow-hidden rounded-xl mb-4">
                                        <img
                                            src={
                                                book.cover_image
                                                    ? `${apiUrl}/storage/${book.cover_image}`
                                                    : "/images/pocketedu.png"
                                            }
                                            alt={book.title}
                                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/images/pocketedu.png";
                                            }}
                                        />
                                    </div>
                                    
                                    <div className="flex-1 flex flex-col">
                                        <h4 
                                            className="text-lg font-bold text-slate-800 line-clamp-2"
                                            title={book.title}
                                        >
                                            {book.title}
                                        </h4>
                                        <p className="text-slate-500 mt-2 text-sm">
                                            {book.author}
                                        </p>
                                        <p className="text-slate-400 text-sm mt-1">
                                            {book.publisher}
                                        </p>
                                    </div>

                                    {book.stock > 0 ? (
                                        <div className="mt-auto flex gap-2">
                                            <button 
                                                onClick={() => handleAddToWishlist(book)} 
                                                className="flex-1 py-2 flex justify-center items-center gap-2 rounded-xl bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors duration-300 font-semibold text-sm"
                                            >
                                                <BookHeart size={16} /> Wishlist
                                            </button>
                                            <button 
                                                onClick={() => navigate(`/books/${book.id}`)} 
                                                className="flex-1 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors duration-300 font-semibold text-sm"
                                            >
                                                View
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            disabled
                                            className="mt-auto w-full py-2 rounded-xl bg-slate-300 text-slate-500 cursor-not-allowed transition-colors duration-300 font-medium"
                                        >
                                        Out of Stock
                                    </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
    );
}
