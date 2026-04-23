import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BookOpen, MessageCircle, ChevronDown } from "lucide-react";

export default function BooksDetail() {
    const navigate = useNavigate();
    const [books, setBooks] = useState(null);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isExpanded, setIsExpanded] = useState(false);
    const charLimit = 250;

    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    useEffect(() => {
        fetchBooks();
    }, [id]);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/books/${id}`);
            setBooks(res.data.data || res.data);
        } catch (err) {
            console.error("Fetch books error", err);
            setError("Failed to fetch books detail.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-1xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            {/* Loading */}
            {loading && (
                <div className="w-full max-w-7xl mx-auto px-8">
                    {books && (
                        <div className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm animate-pulse">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <div className="w-full h-[300px] md:h-[550px] bg-slate-200 rounded-xl"></div>

                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
                                        <div className="flex gap-2">
                                            <div className="w-20 h-4 bg-slate-200 rounded"></div>
                                            <div className="w-10 h-4 bg-slate-200 rounded"></div>
                                        </div>

                                        <div className="w-24 h-8 bg-slate-200 rounded-xl"></div>
                                    </div>
                                </div>

                                <div className="flex flex-col mt-4">
                                    <div className="h-6 bg-slate-200 rounded w-2/3 mb-3"></div>

                                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>

                                    <div className="flex gap-2 mb-4">
                                        <div className="w-16 h-6 bg-slate-200 rounded-md"></div>
                                        <div className="w-16 h-6 bg-slate-200 rounded-md"></div>
                                    </div>

                                    <div className="flex gap-3 mb-4">
                                        <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
                                        <div className="w-24 h-6 bg-slate-200 rounded-full"></div>
                                    </div>

                                    <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                                </div>
                            </div>
                            <div className="h-10 bg-slate-200 rounded-xl mt-5"></div>
                        </div>
                    )}
                </div>
            )}
            {/* Error */}
            {!loading && error && (
                <div className="bg-red-100 border border-red-200 text-red-700 px-5 py-4 rounded-2xl">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
                    {books && (
                        <div
                            key={books.id}
                            className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition duration-300"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <div className="w-full max-w-[300px] mx-auto aspect-[3/4] bg-slate-100 overflow-hidden rounded-xl shadow-sm">
                                        <img
                                            src={
                                                books.cover_image
                                                    ? `${apiUrl}/storage/${books.cover_image}`
                                                    : "/images/pocketedu.png"
                                            }
                                            alt={books.title}
                                            className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/images/pocketedu.png";
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <div className="text-yellow-400 text-lg flex">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <span
                                                                key={star}
                                                                className={
                                                                    star <=
                                                                    Math.round(
                                                                        books.reviews_avg_rating ||
                                                                            0,
                                                                    )
                                                                        ? "text-yellow-400"
                                                                        : "text-slate-200"
                                                                }
                                                            >
                                                                ★
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">
                                                    {books.reviews_avg_rating
                                                        ? Number(
                                                              books.reviews_avg_rating,
                                                          ).toFixed(1)
                                                        : "0.0"}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    ({books.reviews_count || 0}{" "}
                                                    Ulasan)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {books.reviews &&
                                        books.reviews.length > 0 && (
                                            <div className="mt-8 pt-6 border-t border-slate-100 col-span-1 md:col-span-2">
                                                <h4 className="text-lg font-bold text-slate-800 mb-4">
                                                    Ulasan Pembaca
                                                </h4>
                                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                                    {books.reviews.map(
                                                        (review) => (
                                                            <div
                                                                key={review.id}
                                                                className="p-4 rounded-xl bg-slate-50 border border-slate-100"
                                                            >
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-sm font-bold text-slate-700">
                                                                        {review
                                                                            .user
                                                                            ?.username ||
                                                                            review
                                                                                .user
                                                                                ?.name ||
                                                                            "Anonim"}
                                                                    </span>
                                                                    <div className="text-yellow-400 text-xs flex">
                                                                        {[
                                                                            1,
                                                                            2,
                                                                            3,
                                                                            4,
                                                                            5,
                                                                        ].map(
                                                                            (
                                                                                star,
                                                                            ) => (
                                                                                <span
                                                                                    key={
                                                                                        star
                                                                                    }
                                                                                >
                                                                                    {star <=
                                                                                    review.rating
                                                                                        ? "★"
                                                                                        : "☆"}
                                                                                </span>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {review.comment && (
                                                                    <p className="text-slate-600 text-sm mt-1">
                                                                        {
                                                                            review.comment
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </div>

                                <div className="flex flex-col">
                                    <h4 className="text-lg md:text-2xl font-bold text-slate-800 mt-2">
                                        {books.title}
                                    </h4>
                                    <p className="text-slate-500 mt-1 text-sm">
                                        {books.bookshelf.name}
                                    </p>
                                    <p className="text-slate-500 mt-1 text-sm">
                                        {books.author}
                                    </p>
                                    <p className="text-slate-500 mt-1 text-sm">
                                        {books.publisher}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {books.genres && books.genres.length > 0 ? (
                                            books.genres.map((genre) => (
                                                <span 
                                                    key={genre.id} 
                                                    className="px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider rounded-md border border-slate-200"
                                                >
                                                    {genre.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-400 text-xs italic">No genres</span>
                                        )}
                                    </div>

                                    <div className="flex gap-3 mt-3">
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-full 
                                                ${
                                                    books.stock > 0
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {books.stock > 0
                                                ? `Available: ${books.stock}`
                                                : "Out of Stock"}
                                        </span>
                                    </div>

                                    <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-100 relative transition-all duration-300">
                                        <h5 className="text-slate-800 font-bold mb-2 text-sm">
                                            Deskripsi
                                        </h5>
                                        <div className="relative">
                                            <p
                                                className={`text-slate-600 text-sm leading-loose text-justify whitespace-pre-line transition-all duration-500 overflow-hidden ${
                                                    !isExpanded &&
                                                    books.description?.length >
                                                        charLimit
                                                        ? "max-h-24"
                                                        : "max-h-[1000px]"
                                                }`}
                                            >
                                                {books.description}
                                            </p>

                                            {!isExpanded &&
                                                books.description?.length >
                                                    charLimit && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent" />
                                                )}
                                        </div>

                                        {books.description?.length >
                                            charLimit && (
                                            <button
                                                onClick={() =>
                                                    setIsExpanded(!isExpanded)
                                                }
                                                className="mt-2 text-green-600 hover:text-green-700 font-bold text-xs flex items-center gap-1 transition-all"
                                            >
                                                {isExpanded
                                                    ? "Read Less"
                                                    : "Read More"}
                                                <ChevronDown
                                                    size={14}
                                                    className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                                                />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    navigate(`/books/${books.id}/borrow`)
                                }
                                className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-[14px] bg-green-600 text-white font-medium text-[15px] relative overflow-hidden
                                    hover:-translate-y-0.5 hover:bg-green-700 hover:ring-2 hover:ring-green-500/30 hover:ring-offset-1
                                    active:scale-[0.97] active:translate-y-0
                                    transition-all duration-150
                                    [&:hover_svg]:rotate-[-8deg] [&:hover_svg]:scale-110 [&_svg]:transition-transform [&_svg]:duration-200"
                            >
                                <BookOpen size={17} />
                                Borrow
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
