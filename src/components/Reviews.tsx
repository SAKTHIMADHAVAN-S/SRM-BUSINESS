import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, Send, User } from 'lucide-react';
import { api } from '../services/api';
import { Review } from '../types';

export const Reviews = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    const data = await api.getReviews(productId);
    setReviews(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.postReview({ productId, rating, comment });
      setComment('');
      setRating(5);
      loadReviews();
    } catch (err) {
      alert("Please login to post a review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Customer Reviews</h3>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Shared experiences from our community</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <form onSubmit={handleSubmit} className="bg-slate-50 p-8 rounded-[40px] space-y-6">
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Post a Review</h4>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className={`p-2 rounded-xl transition-all ${rating >= s ? 'text-blue-600 bg-blue-50' : 'text-slate-300 hover:text-slate-400'}`}
              >
                <Star className={`w-6 h-6 ${rating >= s ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>
          <textarea
            required
            placeholder="TELL US WHAT YOU THINK..."
            className="w-full bg-white border-none rounded-3xl p-6 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-600 transition-all outline-none min-h-[120px] shadow-sm"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-sm tracking-widest uppercase hover:bg-blue-600 transition-all flex items-center justify-center gap-3 italic"
          >
            {loading ? 'POSTING...' : (
              <>
                <Send className="w-4 h-4" /> SUBMIT REVIEW
              </>
            )}
          </button>
        </form>

        <div className="space-y-6 overflow-y-auto max-h-[500px] pr-4 scrollbar-thin scrollbar-thumb-slate-200">
          {reviews.length === 0 ? (
            <div className="text-center py-20 text-slate-300">
              <MessageCircle className="w-12 h-12 mx-auto mb-4" />
              <p className="font-black uppercase text-[10px] tracking-widest">No reviews yet. Be the first!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-xs font-black italic">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase">{review.userName}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3 h-3 ${review.rating >= s ? 'text-blue-600 fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-tight">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
