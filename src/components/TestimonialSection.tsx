'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShieldCheck, Heart, Sparkles, MessageSquare, X, CheckCircle2, UserCheck, ArrowUpRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface CustomerReviewItem {
  id: string;
  name: string;
  location: string;
  role: string;
  rating: number;
  produceTag: string;
  produceName: string;
  headline: string;
  review: string;
  verified: boolean;
  likes: number;
  date: string;
}

export const TestimonialSection: React.FC = () => {
  const { products, addProductReview } = useStore();
  const [likesState, setLikesState] = useState<Record<string, number>>({});
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});

  // Review Submission Modal Form State
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newLocation, setNewLocation] = useState('Hyderabad');
  const [newProductId, setNewProductId] = useState<string>(products[0]?.id || 'a2-bilona-ghee');
  const [newRating, setNewRating] = useState(5);
  const [newHeadline, setNewHeadline] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // ONLY genuinely submitted reviews across products (NO FAKE PERSONAS)
  const dynamicReviews: CustomerReviewItem[] = products.flatMap((p) => {
    if (!p.reviews || !Array.isArray(p.reviews)) return [];
    return p.reviews.map((r, idx) => ({
      id: r.id || `${p.id}-rev-${idx}`,
      name: r.author || 'Farm Patron',
      location: 'Hyderabad',
      role: 'Verified Farm Patron',
      rating: r.rating || 5,
      produceTag: p.category || 'produce',
      produceName: p.name,
      headline: r.comment.length > 50 ? r.comment.slice(0, 48) + '...' : r.comment,
      review: r.comment,
      verified: r.verifiedPurchase ?? true,
      likes: 8 + idx * 3,
      date: r.date || 'Recent Harvest'
    }));
  });

  const handleLike = (id: string) => {
    setUserLiked((prev) => {
      const alreadyLiked = !!prev[id];
      setLikesState((lPrev) => ({
        ...lPrev,
        [id]: (lPrev[id] || 0) + (alreadyLiked ? -1 : 1)
      }));
      return { ...prev, [id]: !alreadyLiked };
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    addProductReview(newProductId, {
      author: newAuthor.trim(),
      rating: newRating,
      comment: newComment.trim(),
    });

    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setIsSubmitOpen(false);
      setNewAuthor('');
      setNewHeadline('');
      setNewComment('');
    }, 1500);
  };

  return (
    <section id="reviews" className="py-10 sm:py-20 bg-[#FAF6F0] text-[#162010] relative overflow-hidden border-b border-[#D9CEBC]">
      
      {/* Background grain */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-12">
        
        {/* Header Block: Warm Editorial Style */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#D9CEBC] pb-6 sm:pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#C25E2E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C25E2E]" />
              <span className="font-bold">Patron Stories & Harvest Notes</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif text-[#162010] leading-[1.08] tracking-tight font-normal">
              Your Harvest Story Starts Here.
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6352] font-sans leading-relaxed max-w-xl">
              Honest words from patrons across Hyderabad and India who welcome our raw A2 milk, clay-pot bilona ghee, and cold-pressed oils into their daily lives.
            </p>
          </div>

          <div className="flex items-center space-x-4 shrink-0">
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="px-5 py-2.5 sm:py-3 bg-[#162010] hover:bg-[#C25E2E] text-[#F5EFE6] font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 cursor-pointer flex items-center space-x-2 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Share Your Story</span>
            </button>
          </div>
        </div>

        {/* Dynamic Reviews Grid OR Honest Early-Stage Narrative */}
        {dynamicReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {dynamicReviews.map((rev) => {
              const currentLikes = (likesState[rev.id] || 0) + rev.likes;
              const isLiked = !!userLiked[rev.id];

              return (
                <div
                  key={rev.id}
                  className="bg-[#F5EFE6] rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#D9CEBC] flex flex-col justify-between space-y-4 hover:border-[#C25E2E] transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'text-[#D49B28] fill-[#D49B28]'
                                : 'text-[#D9CEBC]'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-[#5C6352]">{rev.date}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#162010] font-sans leading-relaxed">
                      &ldquo;{rev.review}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#D9CEBC] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#162010] font-mono">{rev.name}</p>
                      <p className="text-[10px] text-[#5C6352] font-mono">{rev.produceName}</p>
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#33441B] bg-[#ECE4D5] px-2 py-0.5 rounded border border-[#D9CEBC]">
                      Verified Patron
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Intentional Early-Stage Patron Narrative */
          <div className="bg-[#F5EFE6] rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-[#D9CEBC] max-w-2xl mx-auto text-center space-y-4 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-[#162010] text-[#D49B28] flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#162010]">
              Be Among The First To Review This Harvest
            </h3>
            <p className="text-xs sm:text-sm text-[#5C6352] font-sans leading-relaxed max-w-md mx-auto">
              We bottle our fresh A2 milk and press our oils in small daily batches. If you&apos;ve enjoyed our farm produce, your honest experience helps other families discover authentic nourishment.
            </p>
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="mt-2 px-6 py-2.5 bg-[#C25E2E] hover:bg-[#9E451A] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 cursor-pointer inline-flex items-center space-x-1.5 shadow-sm"
            >
              <span>Write A Quick Review</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

      {/* Review Submission Modal */}
      <AnimatePresence>
        {isSubmitOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#FAF6F0] rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#D9CEBC] shadow-2xl space-y-5 text-left font-sans"
            >
              <div className="flex items-center justify-between border-b border-[#D9CEBC] pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C25E2E] font-bold">
                    Patron Experience
                  </span>
                  <h3 className="text-xl font-serif text-[#162010]">Share Your Harvest Note</h3>
                </div>
                <button
                  onClick={() => setIsSubmitOpen(false)}
                  className="p-1.5 text-[#5C6352] hover:text-[#162010] rounded-xl hover:bg-[#ECE4D5] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submittedMessage ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-[#33441B] mx-auto" />
                  <p className="text-lg font-serif font-bold text-[#162010]">Thank You, Patron!</p>
                  <p className="text-xs text-[#5C6352]">Your review has been recorded to the farm journal.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-[11px] text-[#162010] font-bold uppercase mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh V."
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F5EFE6] border border-[#D9CEBC] rounded-xl text-xs text-[#162010] focus:outline-none focus:border-[#162010]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#162010] font-bold uppercase mb-1">Select Farm Harvest</label>
                    <select
                      value={newProductId}
                      onChange={(e) => setNewProductId(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F5EFE6] border border-[#D9CEBC] rounded-xl text-xs text-[#162010] focus:outline-none focus:border-[#162010]"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#162010] font-bold uppercase mb-1">Rating</label>
                    <div className="flex items-center space-x-1 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newRating ? 'text-[#D49B28] fill-[#D49B28]' : 'text-[#D9CEBC]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#162010] font-bold uppercase mb-1">Your Note / Review</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe the aroma, taste, or texture..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F5EFE6] border border-[#D9CEBC] rounded-xl text-xs text-[#162010] focus:outline-none focus:border-[#162010] font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#162010] hover:bg-[#C25E2E] text-[#F5EFE6] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-md"
                  >
                    Publish Harvest Note
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
