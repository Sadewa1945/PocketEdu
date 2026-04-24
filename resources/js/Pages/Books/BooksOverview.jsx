import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import axios from "axios";
import { BookOpen, Search, Filter, ChevronDown, BookHeart } from "lucide-react";

export default function BooksOverview() {
    const navigate = useNavigate();
    const location = useLocation();
    const { wishlist, setWishlist } = useOutletContext();

    const handleAddToWishlist = (book) => {
        if (wishlist.some((item) => item.id === book.id)) {
            alert("The book is already in the Wishlist!");
            return;
        }
        setWishlist([...wishlist, book]);
    };
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [search, setSearch] = useState("");

    const [selectedBookshelf, setSelectedBookshelf] = useState(
        location.state?.bookshelfFromNav || "All",
    );
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [bookshelf, setBookshelf] = useState(["All"]);
    const [genres, setGenres] = useState(["All"]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    const getBookshelfName = (bookshelf) => {
        if (!bookshelf) return "Uncategorized";
        if (typeof bookshelf === "object")
            return bookshelf.name || "Uncategorized";
        if (typeof bookshelf === "string") return bookshelf;
        return "Uncategorized";
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        const filtered = books.filter((book) => {
            const searchString =
                `${book.title || ""} ${book.author || ""} ${book.publisher || ""}`.toLowerCase();
            const matchesSearch = searchString.includes(search.toLowerCase());

            const bookBookshelf = getBookshelfName(book.bookshelf);

            const matchesBookshelf =
                selectedBookshelf === "All" ||
                bookBookshelf === selectedBookshelf;
            const matchesGenre =
                selectedGenre === "All" ||
                (book.genres &&
                    book.genres.some((g) => g.name === selectedGenre));

            return matchesSearch && matchesBookshelf && matchesGenre;
        });

        setFilteredBooks(filtered);
    }, [search, selectedBookshelf, selectedGenre, books]);

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
                const catRes = await axios.get("/api/bookshelf");
                const catData = Array.isArray(catRes.data)
                    ? catRes.data
                    : catRes.data.data || [];

                if (catData.length > 0) {
                    const catNames = catData.map((c) => c.name);
                    setBookshelf(["All", ...catNames]);
                } else {
                    extractBookshelfFromBooks(bookData);
                }
            } catch (catErr) {
                console.warn(
                    "API bookshelf tidak ditemukan, menggunakan fallback.",
                    catErr,
                );
                extractBookshelfFromBooks(bookData);
            }

            try {
                const genreRes = await axios.get("/api/genres");
                const genreData = Array.isArray(genreRes.data)
                    ? genreRes.data
                    : genreRes.data.data || [];

                if (genreData.length > 0) {
                    const genreNames = genreData.map((g) => g.name);
                    setGenres(["All", ...genreNames]);
                } else {
                    extractGenresFromBooks(bookData);
                }
            } catch (genreErr) {
                console.warn(
                    "API genre tidak ditemukan, menggunakan fallback dari data buku.",
                    genreErr,
                );
                extractGenresFromBooks(bookData);
            }
        } catch (err) {
            console.error("Fetch books error", err);
            setError("Failed to fetch books. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const extractGenresFromBooks = (dataBuku) => {
        const allGenreNames = dataBuku.flatMap((book) =>
            book.genres ? book.genres.map((g) => g.name) : [],
        );
        const uniqueGenres = ["All", ...new Set(allGenreNames)];
        setGenres(uniqueGenres);
    };

    const extractBookshefFromBooks = (dataBuku) => {
        const uniqueBookshelf = [
            "All",
            ...new Set(
                dataBuku.map((book) => getBookshelfName(book.bookshelf)),
            ),
        ];
        setBookshelf(uniqueBookshelf);
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
                    <div className="relative w-full sm:w-72 text-slate-700">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-green-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/10"
                        >
                            <div className="flex items-center gap-3">
                                <Filter
                                    size={18}
                                    className={
                                        isOpen
                                            ? "text-green-500"
                                            : "text-slate-400"
                                    }
                                />
                                <span className="text-sm font-semibold truncate">
                                    {selectedBookshelf !== "All"
                                        ? `Shelf: ${selectedBookshelf}`
                                        : selectedGenre !== "All"
                                          ? `Genre: ${selectedGenre}`
                                          : "All Categories"}
                                </span>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {isOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsOpen(false)}
                                ></div>

                                <div className="absolute z-20 mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top">
                                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                        {/* Option: All */}
                                        <button
                                            onClick={() => {
                                                setSelectedBookshelf("All");
                                                setSelectedGenre("All");
                                                setIsOpen(false);
                                            }}
                                            className="w-full text-left px-5 py-3 text-sm font-medium hover:bg-green-50 hover:text-green-600 transition-colors border-b border-slate-50"
                                        >
                                            All Categories
                                        </button>

                                        <div className="px-5 py-2 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            Bookshelves
                                        </div>
                                        {bookshelf
                                            .filter((b) => b !== "All")
                                            .map((cat, index) => (
                                                <button
                                                    key={`bs-${index}`}
                                                    onClick={() => {
                                                        setSelectedBookshelf(
                                                            cat,
                                                        );
                                                        setSelectedGenre("All");
                                                        setIsOpen(false);
                                                    }}
                                                    className={`w-full text-left px-5 py-3 text-sm transition-all flex items-center gap-2
                                                        ${selectedBookshelf === cat ? "bg-green-50 text-green-600 font-bold" : "hover:bg-slate-50"}`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${selectedBookshelf === cat ? "bg-green-500" : "bg-slate-300"}`}
                                                    ></span>
                                                    {cat}
                                                </button>
                                            ))}

                                        <div className="px-5 py-2 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            Genres
                                        </div>
                                        {genres
                                            .filter((g) => g !== "All")
                                            .map((genre, index) => (
                                                <button
                                                    key={`gn-${index}`}
                                                    onClick={() => {
                                                        setSelectedGenre(genre);
                                                        setSelectedBookshelf(
                                                            "All",
                                                        );
                                                        setIsOpen(false);
                                                    }}
                                                    className={`w-full text-left px-5 py-3 text-sm transition-all flex items-center gap-2
                                                        ${selectedGenre === genre ? "bg-green-50 text-green-600 font-bold" : "hover:bg-slate-50"}`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${selectedGenre === genre ? "bg-green-500" : "bg-slate-300"}`}
                                                    ></span>
                                                    {genre}
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

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

            {!loading && !error && filteredBooks.length > 0 && (
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
                                        onClick={() =>
                                            handleAddToWishlist(book)
                                        }
                                        className="flex-1 py-2 flex justify-center items-center gap-2 rounded-xl bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-colors duration-300 font-semibold text-sm"
                                    >
                                        <BookHeart size={16} /> Wishlist
                                    </button>
                                    <button
                                        onClick={() =>
                                            navigate(`/books/${book.id}`)
                                        }
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
            )}
        </div>
    );
}
