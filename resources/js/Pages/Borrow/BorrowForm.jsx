import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { Calendar, CalendarClock, BookOpen, AlertCircle, Loader2, StickyNote, Hash } from "lucide-react";

export default function BorrowForm() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { user } = useOutletContext();

    const formatDateTimeLocal = (dateObj) => {
        const offset = dateObj.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(dateObj - offset)).toISOString().slice(0, 16);
        return localISOTime;
    };

    const today = new Date();
    const todayStr = formatDateTimeLocal(today);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 7); 
    const tomorrowStr = formatDateTimeLocal(tomorrow);

    const [formData, setFormData] = useState({
        quantity: 1,
        borrowed_at: todayStr,
        due_at: tomorrowStr,
        notes: "",
    });

    const [bookDetail, setBookDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");

    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`/api/books/${id}`);
                setBookDetail(res.data.data || res.data);
            } catch (err) {
                setError("Gagal memuat data buku. Pastikan buku tersedia.");
            } finally {
                setPageLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("/api/borrow", {
                book_id: id,
                quantity: formData.quantity,
                borrowed_at: formData.borrowed_at,
                due_at: formData.due_at,
                notes: formData.notes,
            });

            if (response.data.success) {
                navigate("/borrowing"); 
            }
        } catch (err) {
            console.error("Borrow error:", err);
            if (err.response?.data?.message) {
                let errorMsg = err.response.data.message;
                
                if (err.response.data.errors) {
                    const firstError = Object.values(err.response.data.errors)[0][0];
                    errorMsg = `${errorMsg}: ${firstError}`;
                }
                
                setError(errorMsg);
            } else {
                setError("Terjadi kesalahan saat memproses pinjaman.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex justify-center items-center">
                <Loader2 className="animate-spin text-green-500" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-8">
                Borrow Form
            </h2>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                
                <div className="w-full md:w-2/5 bg-slate-50 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col items-center text-center">
                    <div className="w-40 h-56 bg-white rounded-xl shadow-sm overflow-hidden mb-5 border border-slate-100">
                        <img
                            src={
                                bookDetail?.cover_image
                                    ? `${apiUrl}/storage/${bookDetail.cover_image}`
                                    : "https://placehold.co/300x400?text=No+Cover"
                            }
                            alt="Book Cover"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-2">
                        {bookDetail?.title || "Judul Buku"}
                    </h3>
                    <p className="text-slate-500 mt-1 text-sm">
                        {bookDetail?.author || "Penulis"}
                    </p>
                    
                    <div className="mt-6 w-full p-4 bg-green-50 rounded-2xl border border-green-100">
                        <p className="text-sm text-green-800 font-medium">Stok Tersedia</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                            {bookDetail.available_stock ?? "-"}
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-3/5 p-6 sm:p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700">
                            <AlertCircle size={20} className="shrink-0 mt-0.5" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Number of Books
                            </label>
                            <div className="relative">
                                <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    name="quantity"
                                    min="1"
                                    max={bookDetail?.stock?.available_stock || 1}
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Borrowing Time
                                </label>
                                <div className="relative">
                                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="datetime-local" 
                                        name="borrowed_at"
                                        min={todayStr}
                                        value={formData.borrowed_at}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Book return time
                                </label>
                                <div className="relative">
                                    <CalendarClock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="datetime-local"
                                        name="due_at"
                                        min={formData.borrowed_at} 
                                        value={formData.due_at}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Notes (Optional)
                            </label>
                            <div className="relative">
                                <StickyNote size={18} className="absolute left-4 top-4 text-slate-400" />
                                <textarea
                                    name="notes"
                                    rows="3"
                                    maxLength="500"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Ada catatan khusus untuk pustakawan?"
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition resize-none"
                                ></textarea>
                            </div>
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-2xl hover:bg-slate-50 transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 disabled:bg-green-300 transition font-medium flex justify-center items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Process...
                                    </>
                                ) : (
                                    <>
                                        <BookOpen size={18} />
                                        Borrow Now
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}