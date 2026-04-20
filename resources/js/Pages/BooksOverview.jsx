import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
    BookOpen,
    Search,
    Filter
} from "lucide-react";

export default function BooksOverview() {
    const navigate = useNavigate();
    const location = useLocation();
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [search, setSearch] = useState("");

    const [selectedCategory, setSelectedCategory] = useState(location.state?.categoryFromNav || "All");
    const [categories, setCategories] = useState(["All"]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    const getCategoryName = (category) => {
        if (!category) return "Uncategorized";
        if (typeof category === "object") return category.name || "Uncategorized";
        if (typeof category === "string") return category;
        return "Uncategorized";
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        const filtered = books.filter((book) => {
            const searchString = `${book.title || ''} ${book.author || ''} ${book.publisher || ''}`.toLowerCase();
            const matchesSearch = searchString.includes(search.toLowerCase());

            const bookCategory = getCategoryName(book.category);
            const matchesCategory = selectedCategory === "All" || bookCategory === selectedCategory;

            return matchesSearch && matchesCategory;
        });
        setFilteredBooks(filtered);
    }, [search, selectedCategory, books]);

    const fetchAllData = async () => {
        try {
            setLoading(true);

            const booksRes = await axios.get("/api/books");
            const bookData = Array.isArray(booksRes.data) 
                ? booksRes.data 
                : booksRes.data.data || [];

            const sortedBooks = [...bookData].reverse();
            setBooks(sortedBooks);
            setFilteredBooks(sortedBooks);

            try {
                const catRes = await axios.get("/api/categories");
                const catData = Array.isArray(catRes.data) 
                    ? catRes.data 
                    : catRes.data.data || [];

                if (catData.length > 0) {
                    const catNames = catData.map(c => c.name);
                    setCategories(["All", ...catNames]);
                } else {
                    extractCategoriesFromBooks(bookData);
                }
            } catch (catErr) {
                console.warn("API Kategori tidak ditemukan, menggunakan fallback.", catErr);
                extractCategoriesFromBooks(bookData);
            }

        } catch (err) {
            console.error("Fetch books error", err);
            setError("Failed to fetch books. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const extractCategoriesFromBooks = (dataBuku) => {
        const uniqueCategories = [
            "All",
            ...new Set(dataBuku.map(book => getCategoryName(book.category)))
        ];
        setCategories(uniqueCategories);
    };

    return (
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

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        
                        {/* Dropdown Filter */}
                        <div className="relative w-full sm:w-48 text-slate-700">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full appearance-none pl-4 pr-10 py-3 rounded-2xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                            >
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                            <Filter 
                                size={16} 
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />
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

                {!loading && !error && filteredBooks.length > 0 &&  (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                            {filteredBooks.map((book) => (
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

                                    {book.stock > 0 ? (
                                        <button 
                                            onClick={() => navigate(`/books/${book.id}`)} 
                                            className="mt-auto w-full py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors duration-300"
                                        >
                                            Borrow
                                        </button>
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
                )}
            </div>
    );
}