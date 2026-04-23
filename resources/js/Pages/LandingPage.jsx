import React, { useState, useEffect } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import { 
    LogOut, 
    Menu, 
    X, 
    User, 
    Home, 
    Book, 
    RotateCw, 
    Undo2, 
    Layers, 
    ChevronDown,
    Mail,
    Phone,
    MapPin,
    Bell,
    CheckCircle2
    } from "lucide-react";

export default function LandingPage({ user, setUser }) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [books, setBooks] = useState([]);
    const [notifModalOpen, setNotifModalOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const appName = import.meta.env.VITE_APP_NAME || "PocketEdu";
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    const profileImage = user?.image ? `${apiUrl}/storage/${user.image}` : null;

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

     useEffect(() => {
            fetchBooks();
    });

    const latestBooks = [...books].slice(-4).reverse();

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    return (
        <div className="min-h-screen flex flex-col w-full bg-gradient-to-br from-green-100 via-white to-emerald-100">
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
                            to="/register"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/register"
                            className=" text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Books
                        </Link>

                        <Link
                            to="/register"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Borrowings
                        </Link>

                        <Link
                            to="/register"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Returns
                        </Link>

                        <Link
                            to="/register"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Bookshelves
                        </Link>
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
                        {/* Navigation */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
                            <p className="px-3 pt-2 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Navigation
                            </p>

                            <div className="space-y-1">
                                <Link
                                    to="/register"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-green-700 transition"
                                >
                                    <Home size={20} />
                                    Dashboard
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-green-700 transition"
                                >
                                    <Book size={20} />
                                    Books
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-green-700 transition"
                                >
                                    <RotateCw size={20} />
                                    Borrowings
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-green-700 transition"
                                >
                                    <Undo2 size={20} />
                                    Returns
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-green-700 transition"
                                >
                                    <Layers size={20} />
                                    Bookshelves
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center justify-center text-center">
    
                <h1 className="text-4xl sm:text-5xl md:text-6xl text-slate-800 font-bold font-sans mb-8 tracking-tight">
                    Welcome to Pocketedu, <br className="hidden sm:block" /> 
                    <span className="text-green-500">the best place to borrow books.</span>
                </h1>
                
                <button
                    onClick={() => navigate("/register")}
                    className="px-8 py-3 rounded-full bg-green-500 text-white font-semibold text-lg shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                    Get Started
                </button>

            </div>

            <div className="mt-10 p-10 flex flex-col items-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl text-slate-800 font-bold font-sans tracking-tight">
                    New Books
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-15">
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
                        </div>
                    ))}
                </div>
            </div>
                    
            <footer className="bg-white border-t border-slate-200 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-1">
                            <h2 className="text-2xl font-bold text-green-700 mb-4">
                                {appName}
                            </h2>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                A modern digital library solution for easier, faster, and more accessible knowledge anywhere.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-800 mb-4">
                                Service
                            </h3>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><Link to="/register" className="hover:text-green-600 transition">Books</Link></li>
                                <li><Link to="/register" className="hover:text-green-600 transition">Bookshelves</Link></li>
                                <li><Link to="/register" className="hover:text-green-600 transition">Borrowing</Link></li>
                                <li><Link to="/register" className="hover:text-green-600 transition">Return</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-800 mb-4">
                                Contact Us
                            </h3>

                            <ul className="space-y-3 text-sm text-slate-600">
                                    <li className="flex items-center gap-2">
                                        <Mail size={16} className="text-green-600" />
                                        support@pocketedu.id
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Phone size={16} className="text-green-600" />
                                        +62 857 189 44257
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <MapPin size={16} className="text-green-600 mt-1" />
                                        Alamat
                                    </li>
                                </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-400">
                            © {new Date().getFullYear()} {appName}. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm text-slate-400">
                            <a href="#" className="hover:text-slate-600 transition">Privacy Policy</a>
                            <a href="#" className="hover:text-slate-600 transition">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}