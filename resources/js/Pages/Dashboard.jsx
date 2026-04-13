import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    BookOpen,
    Library,
    ClipboardList,
} from "lucide-react";

export default function Dashboard({ user, setUser }) {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [borrowingsCount, setBorrowingsCount] = useState(0);
    const [categoriesCount, setCategoriesCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    useEffect(() => {
        const fetchAllData = async () => {
            await Promise.all([
                fetchBooks(),
                fetchBorrowingsCount(),
                fetchCategoriesCount(),
            ]);
        };
        fetchAllData();
    }, []);

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

    const fetchCategoriesCount = async () => {
        try {
            const res = await axios.get("/api/categories");
            const categories = Array.isArray(res.data)
                ? res.data
                : res.data.data || [];
            setCategoriesCount(categories.length);
        } catch (err) {
            console.error("Fetch categories count error", err);
        } finally {
            setLoading(false);
        }
    };

    const latestBooks = [...books].slice(-4).reverse();
    const allBooks = [...books].slice(0, 20).reverse();

    const stats = [
        {
            title: "Total Books",
            value: books.length,
            icon: <Library size={28} className="text-green-500" />,
        },
        {
            title: "Total Borrowed",
            value: borrowingsCount,
            icon: <BookOpen size={28} className="text-green-500" />,
        },
        {
            title: "Total Categories",
            value: categoriesCount,
            icon: <ClipboardList size={28} className="text-green-500" />,
        },
    ];

    return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">
                    Dashboard
                </h2>

                {loading && <p className="text-slate-600">Loading...</p>}
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
                                        <h3 className="text-2xl sm:text-3xl mt-4 text-green-500 font-bold">
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
                                                    : "https://placehold.co/300x400?text=No+Cover"
                                            }
                                            alt={book.title}
                                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                                            onError={(e) =>
                                                (e.target.src =
                                                    "https://placehold.co/300x400?text=No+Cover")
                                            }
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

                                    <button onClick={() => navigate(`/books/${book.id}`)} className="mt-auto w-full py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors duration-300">
                                        Borrow
                                    </button>
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
                                                    : "https://placehold.co/300x400?text=No+Cover"
                                            }
                                            alt={book.title}
                                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                                            onError={(e) =>
                                                (e.target.src =
                                                    "https://placehold.co/300x400?text=No+Cover")
                                            }
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

                                    <button onClick={() => navigate(`/books/${book.id}`)} className="mt-auto w-full py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors duration-300">
                                        Borrow
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
    );
}
