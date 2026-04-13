import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
    BookOpen,
    LogOut,
    Menu,
    X,
    Search,
    User,
    ChevronDown,
    Home,
    Book,
    RotateCw,
    Undo2,
    Layers,
} from "lucide-react";

export default function BooksOverview({ user, setUser }) {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const appName = import.meta.env.VITE_APP_NAME || "PocketEdu";
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
     const profileImage = user?.image ? `${apiUrl}/storage/${user.image}` : null;

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        const filtered = books.filter((book) =>
            `${book.title} ${book.author} ${book.publisher}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );
        setFilteredBooks(filtered);
    }, [search, books]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/books");
            const bookData = Array.isArray(res.data)
                ? res.data
                : res.data.data || [];

            const sortedBooks = [...bookData].reverse();
            setBooks(sortedBooks);
            setFilteredBooks(sortedBooks);
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
            localStorage.removeItem("user");
            setUser(null);
            navigate("/login");
        }
    };

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
                    <div className="hidden md:flex gap-6 items-center relative">
                        <Link
                            to="/dashboard"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/books"
                            className=" text-green-600 font-semibold"
                        >
                            Books
                        </Link>

                        <Link
                            to="/borrowings"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Borrowings
                        </Link>

                        <Link
                            to="/returns"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Returns
                        </Link>

                        <Link
                            to="/categories"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Categories
                        </Link>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                            >
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                        <User size={20} className="text-slate-600" />
                                    </div>
                                )}

                                <span className="text-slate-700 font-medium max-w-[120px] truncate">
                                    {user?.name || "User"}
                                </span>

                                <ChevronDown
                                    size={18}
                                    className={`text-slate-500 transition-transform duration-300 ${
                                        profileOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 mt-3 w-52 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="font-semibold text-slate-800">
                                            {user?.name || "User"}
                                        </p>
                                        <p className="text-sm text-slate-500 truncate">
                                            {user?.username || user?.email || "No info"}
                                        </p>
                                    </div>

                                    <Link
                                        to="/user/profile"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-green-50 hover:text-green-700 transition"
                                    >
                                        <User size={18} />
                                        Profile
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Right Actions */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className={`p-2.5 rounded-2xl border transition-all duration-300 ${
                                menuOpen
                                    ? "bg-green-500 border-green-500 text-white shadow-md"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                            <div
                                className={`transition-transform duration-300 ${
                                    menuOpen ? "rotate-180" : "rotate-0"
                                }`}
                            >
                                {menuOpen ? <X size={22} /> : <Menu size={22} />}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        menuOpen
                            ? "max-h-[700px] opacity-100 translate-y-0 border-t border-slate-200"
                            : "max-h-0 opacity-0 -translate-y-2"
                    } bg-white`}
                >
                    <div className="px-4 py-4 space-y-4">
                        {/* Profile Card */}
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center border-2 border-white shadow-sm">
                                        <User size={24} className="text-green-700" />
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 truncate">
                                        {user?.name || "User"}
                                    </p>
                                    <p className="text-sm text-slate-500 truncate">
                                        {user?.username || user?.email || "No info"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <Link
                                    to="/user/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                                >
                                    <User size={18} />
                                    Profile
                                </Link>

                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMenuOpen(false);
                                    }}
                                    className="flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-medium text-white hover:bg-red-600 transition"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
                            <p className="px-3 pt-2 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Navigation
                            </p>

                            <div className="space-y-1">
                                <Link
                                    to="/dashboard"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-green-700 transition"
                                >
                                    <Home size={20} />
                                    Dashboard
                                </Link>

                                <Link
                                    to="/books"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-green-700 transition"
                                >
                                    <Book size={20} />
                                    Books
                                </Link>

                                <Link
                                    to="/borrowings"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-green-700 transition"
                                >
                                    <RotateCw size={20} />
                                    Borrowings
                                </Link>

                                <Link
                                    to="/returns"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-green-700 transition"
                                >
                                    <Undo2 size={20} />
                                    Returns
                                </Link>

                                <Link
                                    to="/categories"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-green-50 text-green-700 font-semibold"
                                >
                                    <Layers size={20} />
                                    Categories
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                            Books Overview
                        </h2>
                        <p className="text-slate-500 mt-2">
                            Explore all available books in your digital library.
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm animate-pulse"
                            >
                                <div className="w-full h-56 bg-slate-200 rounded-xl mb-4"></div>
                                <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
                                <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                                <div className="h-4 bg-slate-200 rounded w-2/3 mb-5"></div>
                                <div className="h-10 bg-slate-200 rounded-xl"></div>
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

                {/* Empty */}
                {!loading && !error && filteredBooks.length === 0 && (
                    <div className="bg-white border border-green-100 shadow-sm rounded-3xl p-10 text-center">
                        <BookOpen className="mx-auto w-12 h-12 text-green-500 mb-4" />
                        <h3 className="text-xl font-bold text-slate-800">
                            No books found
                        </h3>
                        <p className="text-slate-500 mt-2">
                            Try searching with another keyword.
                        </p>
                    </div>
                )}

                {/* Books Grid */}
                {!loading && !error && filteredBooks.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {filteredBooks.map((book) => (
                            <div
                                key={book.id}
                                className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition duration-300"
                            >
                                <div className="w-full h-56 bg-slate-100 overflow-hidden rounded-xl">
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

                                <h4 className="text-lg font-bold text-slate-800 line-clamp-2 mt-4">
                                    {book.title}
                                </h4>
                                <p className="text-slate-500 mt-2 text-sm">
                                    {book.author}
                                </p>
                                <p className="text-slate-400 text-sm mt-1">
                                    {book.publisher}
                                </p>

                                <button onClick={() => navigate(`/books/${book.id}`)} className="mt-5 w-full py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors duration-300">
                                    Borrow
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}