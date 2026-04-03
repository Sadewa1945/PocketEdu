import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
    BookOpen,
    Library,
    ClipboardList,
    LogOut,
    Menu,
    X,
} from "lucide-react";

export default function Dashboard({ user, setUser }) {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const appName = import.meta.env.VITE_APP_NAME || "PocketEdu";
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/books");
            const bookData = Array.isArray(res.data)
                ? res.data
                : res.data.data || [];
            setBooks(bookData);
        } catch (err) {
            console.error("Fetch books error", err);
            setError("Failed to fetch books. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            setUser(null);
            navigate("/login");
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
            value: "-",
            icon: <BookOpen size={28} className="text-green-500" />,
        },
        {
            title: "Total Categories",
            value: "-",
            icon: <ClipboardList size={28} className="text-green-500" />,
        },
    ];

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-white to-emerald-100">
            {/* Navbar */}
             <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                            {appName}
                        </h1>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-6 items-center">
                        <Link
                            to="/dashboard"
                            className="text-green-600 font-semibold"
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/books"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Books
                        </Link>
                        <a
                            href="#"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Borrowings
                        </a>
                        <a
                            href="#"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Returns
                        </a>
                        <a
                            href="#"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Categories
                        </a>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
                    >
                        <div
                            className={`transition-transform duration-300 ${
                                menuOpen
                                    ? "rotate-180 scale-100"
                                    : "rotate-0 scale-100"
                            }`}
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </div>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        menuOpen
                            ? "max-h-96 opacity-100 translate-y-0 border-t border-green-200"
                            : "max-h-0 opacity-0 -translate-y-2"
                    } bg-white px-4 sm:px-6 shadow-sm`}
                >
                    <div className="py-4 space-y-3">
                        <Link
                            to="/dashboard"
                            onClick={() => setMenuOpen(false)}
                            className="block text-green-600 font-semibold"
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/books"
                            onClick={() => setMenuOpen(false)}
                            className="block text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Books
                        </Link>
                        <a
                            href="#"
                            onClick={() => setMenuOpen(false)}
                            className="block text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Borrowings
                        </a>
                        <a
                            href="#"
                            onClick={() => setMenuOpen(false)}
                            className="block text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Returns
                        </a>
                        <a
                            href="#"
                            onClick={() => setMenuOpen(false)}
                            className="block text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Categories
                        </a>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">
                    Home
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

                {/* Optional Latest Books Preview */}
                {!loading && books.length > 0 && (
                    <div className="mt-10">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-5">
                            Latest Books
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                            {latestBooks.map((book) => (
                                <div
                                    key={book.id}
                                    className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition duration-300"
                                >
                                    <div className="w-full h-56 bg-slate-100 overflow-hidden">
                                        <img
                                            src={
                                                book.cover_image
                                                    ? `${apiUrl}/storage/${book.cover_image}`
                                                    : "https://placehold.co/300x400?text=No+Cover"
                                            }
                                            alt={book.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                            onError={(e) =>
                                                (e.target.src =
                                                    "https://placehold.co/300x400?text=No+Cover")
                                            }
                                        />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-800 line-clamp-2">
                                        {book.title}
                                    </h4>
                                    <p className="text-slate-500 mt-2 text-sm">
                                        {book.author}
                                    </p>
                                    <p className="text-slate-400 text-sm mt-1">
                                        {book.publisher}
                                    </p>

                                    <button className="mt-5 w-full py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors duration-300">
                                        Borrow
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Optional Latest Books Preview */}
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
                                    className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition duration-300"
                                >
                                    <div className="w-full h-56 bg-slate-100 overflow-hidden">
                                        <img
                                            src={
                                                book.cover_image
                                                    ? `${apiUrl}/storage/${book.cover_image}`
                                                    : "https://placehold.co/300x400?text=No+Cover"
                                            }
                                            alt={book.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                            onError={(e) =>
                                                (e.target.src =
                                                    "https://placehold.co/300x400?text=No+Cover")
                                            }
                                        />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-800 line-clamp-2">
                                        {book.title}
                                    </h4>
                                    <p className="text-slate-500 mt-2 text-sm">
                                        {book.author}
                                    </p>
                                    <p className="text-slate-400 text-sm mt-1">
                                        {book.publisher}
                                    </p>

                                    <button className="mt-5 w-full py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors duration-300">
                                        Borrow
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
