import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    BookOpen,
    MessageCircle,
} from "lucide-react";

export default function BooksDetail() {
    const navigate = useNavigate();
    const [books, setBooks] = useState(null);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
                        <div
                            className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm animate-pulse"
                        >

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
  
                                            <div className="w-full aspect-[3/4] bg-slate-100 overflow-hidden rounded-xl shadow-sm">
                                                <img
                                                    src={
                                                        books.cover_image
                                                        ? `${apiUrl}/storage/${books.cover_image}`
                                                        : "https://placehold.co/300x400?text=No+Cover"
                                                    }
                                                    alt={books.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                                                    />
                                            </div>
                                        
                                        <div className="flex items-center justify-between mt-4">

                                            <div className="flex items-center gap-2">
                                                <div className="text-yellow-400 text-lg">★★★★☆</div>
                                                <span className="text-sm text-gray-500">(120)</span>
                                            </div>

                                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all duration-300 hover:scale-105">
                                                <MessageCircle size={18} />
                                                Comment
                                            </button>

                                        </div>
                                        
                                    </div>

                                    <div className="flex flex-col">
                                        <h4 className="text-lg md:text-2xl font-bold text-slate-800 mt-2">
                                            {books.title}
                                        </h4>
                                        <p className="text-slate-500 mt-1 text-sm">
                                            {books.category.name}
                                        </p>
                                        <p className="text-slate-500 mt-1 text-sm">
                                            {books.author}
                                        </p>
                                        <p className="text-slate-500 mt-1 text-sm">
                                            {books.publisher}
                                        </p>

                                        <div className="flex gap-3 mt-3">
                
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                                            Total: {books.total_stock}
                                        </span>

                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full 
                                            ${books.available_stock > 0 
                                                ? "bg-green-100 text-green-700" 
                                                : "bg-red-100 text-red-700"}`}>
                                            
                                            {books.available_stock > 0 
                                                ? `Available: ${books.available_stock}` 
                                                : "Out of Stock"}
                                        </span>

                                    </div>
                                        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-slate-600 text-sm leading-relaxed text-justify whitespace-pre-line max-h-[300px] overflow-y-auto pr-2">
                                                {books.description}
                                            </p>
                                        </div>
                                    </div>

                                </div>

                                <button 
                                    onClick={() => navigate(`/books/${books.id}/borrow`)}
                                    className="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-[14px] bg-green-600 text-white font-medium text-[15px] relative overflow-hidden
                                    hover:-translate-y-0.5 hover:bg-green-700 hover:ring-2 hover:ring-green-500/30 hover:ring-offset-1
                                    active:scale-[0.97] active:translate-y-0
                                    transition-all duration-150
                                    [&:hover_svg]:rotate-[-8deg] [&:hover_svg]:scale-110 [&_svg]:transition-transform [&_svg]:duration-200">
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