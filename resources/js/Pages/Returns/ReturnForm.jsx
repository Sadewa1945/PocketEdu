import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { Calendar, CalendarClock, BookOpen, AlertCircle, Loader2, StickyNote, Hash } from "lucide-react";

export default function ReturnForm() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { user } = useOutletContext();

    const [formData, setFormData] = useState({
        quantity_returned: 1,
        return_condition: "",
        notes: "",
    });

    const [returnForm, setReturnForm] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");

    const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    useEffect(() => {
        const fetchReturn = async () => {
            try {
                const res = await axios.get(`/api/borrowing/${id}`);
                setReturnForm(res.data.data || res.data);
            } catch (err) {
                setError("Failed to load return book data. Ensure loan is available..");
            } finally {
                setPageLoading(false);
            }
        };
        fetchReturn();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const bookData = returnForm?.borrowings_book || returnForm || {};

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const payload = {
                quantity_returned: formData.quantity_returned,
                return_condition: formData.return_condition,
                notes: formData.notes,
            }

            const response = await axios.post(`/api/borrowing/${id}/returns`, payload);

            if (response.status === 200) {
                navigate("/return"); 
            }
        } catch (err) {
            console.error("Returns error:", err);
            if (err.response?.data?.message) {
                let errorMsg = err.response.data.message;
                
                if (err.response.data.errors) {
                    const firstError = Object.values(err.response.data.errors)[0][0];
                    errorMsg = `${errorMsg}: ${firstError}`;
                }
                
                setError(errorMsg);
            } else {
                setError("An error occurred while processing the return.");
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
                Return Form
            </h2>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                
                <div className="w-full md:w-2/5 bg-slate-50 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col items-center text-center">
                    <div className="w-40 h-56 bg-white rounded-xl shadow-sm overflow-hidden mb-5 border border-slate-100">
                        <img
                            src={
                                bookData?.cover_image
                                    ? `${apiUrl}/storage/${bookData.cover_image}`
                                    : "https://placehold.co/300x400?text=No+Cover"
                            }
                            alt="Book Cover"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-2">
                        {bookData?.title || "Judul Buku"}
                    </h3>
                    <p className="text-slate-500 mt-1 text-sm">
                        {bookData?.author || "Penulis"}
                    </p>
                    
                    <div className="mt-6 w-full p-4 bg-green-50 rounded-2xl border border-green-100">
                        <p className="text-sm text-green-800 font-medium">Borrowed Book</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                            {returnForm.quantity ?? "-"}
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
                                    name="quantity_returned"
                                    min="1"
                                    max={returnForm?.quantity || 1}
                                    value={formData.quantity_returned}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Return Conditions (Optional)
                            </label>
                            <div className="relative">
                                <StickyNote size={18} className="absolute left-4 top-4 text-slate-400" />
                                <textarea
                                    name="return_condition"
                                    rows="3"
                                    maxLength="500"
                                    value={formData.return_condition}
                                    onChange={handleChange}
                                    placeholder="write the condition of the book when it is returned"
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition resize-none"
                                ></textarea>
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
                                    placeholder="Any special notes for librarians?"
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
                                        Returns Now
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