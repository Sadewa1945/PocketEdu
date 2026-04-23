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

export default function MainLayout({ user, setUser }) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const [notifModalOpen, setNotifModalOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const appName = import.meta.env.VITE_APP_NAME || "PocketEdu";
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    const profileImage = user?.image ? `${apiUrl}/storage/${user.image}` : null;

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('/api/notifications'); 
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unread_count);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await axios.post(`/api/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error("Failed to mark as read", error);
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
        <div className="min-h-screen flex flex-col w-full bg-gradient-to-br from-green-100 via-white to-emerald-100">
            {notifModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                <Bell className="text-green-600" size={20} />
                                Notifications
                            </h3>
                            <button onClick={() => setNotifModalOpen(false)} className="p-2 bg-white text-slate-400 hover:text-red-500 rounded-full shadow-sm transition">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto p-4 space-y-3 flex-1 bg-white">
                            {notifications.length === 0 ? (
                                <div className="text-center py-10 text-slate-400">
                                    <Bell size={40} className="mx-auto mb-3 opacity-20" />
                                    <p>No new notifications</p>
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <div key={notif.id} className={`p-4 rounded-2xl border transition ${notif.read_at === null ? 'bg-green-50/50 border-green-200' : 'bg-white border-slate-100'}`}>
                                        <div className="flex justify-between items-start gap-3">
                                            <div>
                                                <h4 className={`text-sm font-bold ${notif.read_at === null ? 'text-slate-800' : 'text-slate-600'}`}>{notif.data.title}</h4>
                                                <p className="text-xs text-slate-500 mt-1">{notif.data.message}</p>
                                            </div>
                                            {notif.read_at === null && (
                                                <button onClick={() => markAsRead(notif.id)} className="p-1 text-green-500 hover:bg-green-100 rounded-md transition">
                                                    <CheckCircle2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
           
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
                            className=" text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Books
                        </Link>

                        <Link
                            to="/borrowing"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Borrowings
                        </Link>

                        <Link
                            to="/return"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Returns
                        </Link>

                        <Link
                            to="/categories"
                            className="text-slate-600 hover:text-green-700 transition-colors duration-300"
                        >
                            Bookshelves
                        </Link>

                        <button 
                            onClick={() => setNotifModalOpen(true)}
                            className="relative p-2 text-slate-500 hover:text-green-600 transition hover:bg-slate-50 rounded-full"
                        >
                            <Bell size={22} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </button>

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

                                <button 
                                        onClick={() => setNotifModalOpen(true)}
                                        className="relative p-2 text-slate-500 hover:text-green-600 transition hover:bg-slate-50 rounded-full"
                                    >
                                        <Bell size={22} />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                        )}
                                    </button>
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
                                    to="/borrowing"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-green-700 transition"
                                >
                                    <RotateCw size={20} />
                                    Borrowings
                                </Link>

                                <Link
                                    to="/return"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-green-700 transition"
                                >
                                    <Undo2 size={20} />
                                    Returns
                                </Link>

                                <Link
                                    to="/categories"
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

            <main className="flex-grow">
                <Outlet context={{ user, setUser }} /> 
            </main>

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
                                <li><Link to="/books" className="hover:text-green-600 transition">Books</Link></li>
                                <li><Link to="/categories" className="hover:text-green-600 transition">Categories</Link></li>
                                <li><Link to="/borrowing" className="hover:text-green-600 transition">Borrowing</Link></li>
                                <li><Link to="/return" className="hover:text-green-600 transition">Return</Link></li>
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