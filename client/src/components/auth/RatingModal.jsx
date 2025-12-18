import React, { useState } from 'react';
import { Star, CheckCircle, Loader2, X, MessageSquare } from 'lucide-react';
import axios from 'axios';

const RatingModal = ({ isOpen, onClose, astrologerId }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Static messages for quick selection
    const quickTags = [
        "Excellent Advice", "Very Patient", "Accurate Reading", 
        "Highly Recommended", "Helpful Remedies", "Calming Session"
    ];

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === 0) return;
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            await axios.post(`${API_URL}/api/reviews/submit`, {
                astrologerId,
                rating,
                comment: comment.trim()
            }, { withCredentials: true });

            setSubmitted(true);
            setTimeout(() => {
                onClose();
                resetState();
            }, 2000);
        } catch (error) {
            alert("Failed to submit rating. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setSubmitted(false);
        setRating(0);
        setComment("");
    };

    return (
        <div className="fixed inset-0 z-[150] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative border border-white/10 overflow-hidden">
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
                >
                    <X size={20} />
                </button>

                {!submitted ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-black mb-2 dark:text-white uppercase tracking-tight">Rate Session</h3>
                            <p className="text-slate-500 text-sm italic">Your feedback shapes our cosmic community</p>
                        </div>
                        
                        {/* Star Rating Section */}
                        <div className="flex justify-center gap-2 mb-10">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={44}
                                    className={`cursor-pointer transition-all transform ${
                                        star <= (hover || rating) ? 'fill-amber-500 text-amber-500 scale-110' : 'text-slate-200'
                                    } hover:scale-125`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                />
                            ))}
                        </div>

                        {/* Quick Feedback Tags */}
                        <div className="mb-6">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Quick Feedback</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {quickTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setComment(tag)}
                                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border ${
                                            comment === tag 
                                            ? 'bg-amber-500 border-amber-500 text-white' 
                                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-amber-400'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Optional Comment Box */}
                        <div className="relative mb-8">
                            <div className="absolute top-3 left-4 text-slate-400">
                                <MessageSquare size={16} />
                            </div>
                            <textarea 
                                placeholder="Add a custom note (optional)..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-amber-500 transition-colors text-sm min-h-[100px] resize-none font-medium"
                            />
                        </div>

                        <button 
                            onClick={handleSubmit} 
                            disabled={!rating || loading}
                            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Complete Review"}
                        </button>
                    </div>
                ) : (
                    <div className="py-12 text-center animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={48} className="text-green-500" />
                        </div>
                        <h3 className="text-2xl font-black dark:text-white mb-2">Gratitude Received!</h3>
                        <p className="text-slate-500 text-sm">Your feedback helps others find guidance.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RatingModal;