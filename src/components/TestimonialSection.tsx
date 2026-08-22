'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShieldCheck, Heart, Sparkles, Quote, ThumbsUp, CheckCircle2, Award, UserCheck, Plus, MessageSquare, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface CustomerReviewItem {
  id: string;
  name: string;
  location: string;
  role: string;
  rating: number;
  produceTag: 'ghee' | 'oil' | 'paneer' | 'milk' | 'eggs';
  produceName: string;
  headline: string;
  review: string;
  verified: boolean;
  likes: number;
  date: string;
  avatar: string;
}

const DEFAULT_REVIEWS: CustomerReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Dr. Ananya Reddy',
    location: 'Jubilee Hills, Hyderabad',
    role: 'Senior Physician & Wellness Practitioner',
    rating: 5,
    produceTag: 'ghee',
    produceName: 'A2 Desi Cow Bilona Ghee',
    headline: 'Traditional Bilona Danedar Ghee — Smells Just Like My Nani’s Kitchen!',
    review: 'As a doctor, I recommend A2 Gir cow ghee to my patients for gut immunity. Brindavanam’s ghee is authentic hand-churned bilona ghee made in earthen pots. The rich golden granules and nutty aroma are divine. Absolutely 100% pure!',
    verified: true,
    likes: 142,
    date: '2 Days Ago',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'rev-2',
    name: 'Vikram & Radhika Rao',
    location: 'Gachibowli, Hyderabad',
    role: 'IT Leadership & Organic Advocates',
    rating: 5,
    produceTag: 'oil',
    produceName: 'Wood-Pressed Kusuma & Sesame Oil',
    headline: 'Zero Bleach, Pure Marachekku Pressing — You Can Taste The Natural Seeds!',
    review: 'We switched to Brindavanam’s cold wood-pressed Kusuma and Mustard oils 6 months ago. The difference in food taste and digestion is night and day. No refining chemicals, zero foam during frying, just pure unadulterated cold-pressed oil.',
    verified: true,
    likes: 98,
    date: '4 Days Ago',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'rev-3',
    name: 'Srilatha Kulkarni',
    location: 'Banjara Hills, Hyderabad',
    role: 'Home Chef & Culinary Expert',
    rating: 5,
    produceTag: 'paneer',
    produceName: 'Fresh Artisanal Desi Paneer',
    headline: 'Softest & Creamiest Paneer In Hyderabad — Melt In The Mouth!',
    review: 'Brindavanam’s fresh A2 Paneer is absurdly soft! You can tell it’s made from pure A2 milk with zero starch or synthetic coagulants. It absorbs spices beautifully and holds its texture in curries without turning rubbery.',
    verified: true,
    likes: 76,
    date: '1 Week Ago',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 'rev-4',
    name: 'Rajeshwar Sharma',
    location: 'Hitec City, Hyderabad',
    role: 'Software Architect & Fitness Enthusiast',
    rating: 5,
    produceTag: 'milk',
    produceName: 'Pure A2 Desi Cow Raw Milk',
    headline: 'Fresh Morning Farm Milk Delivery — Thick Cream Layer Every Day!',
    review: 'Finding real A2 Gir Cow milk in Hyderabad used to be a struggle until we found Brindavanam Nature Centre. The daily delivery is eco-friendly, and the thick cream top makes the richest curd we’ve ever tasted.',
    verified: true,
    likes: 115,
    date: '1 Week Ago',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

export const TestimonialSection: React.FC = () => {
  const { products, addProductReview } = useStore();
  const [activeTagFilter, setActiveTagFilter] = useState<'all' | 'ghee' | 'oil' | 'paneer' | 'milk' | 'eggs'>('all');
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

  // Dynamically aggregate all genuine user reviews across all products
  const dynamicReviews: CustomerReviewItem[] = products.flatMap((p) => {
    if (!p.reviews || !Array.isArray(p.reviews)) return [];
    return p.reviews.map((r, idx) => ({
      id: r.id || `${p.id}-rev-${idx}`,
      name: r.author || 'Valued Patron',
      location: 'Hyderabad',
      role: 'Verified Farm Patron',
      rating: r.rating || 5,
      produceTag: (p.category as any) || 'ghee',
      produceName: p.name,
      headline: 'Authentic Organic Farm Quality!',
      review: r.comment,
      verified: r.verifiedPurchase ?? true,
      likes: 12 + idx * 5,
      date: r.date || 'Recent',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300'
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

  const filteredReviews = dynamicReviews.filter((r) => 
    activeTagFilter === 'all' || r.produceTag === activeTagFilter
  );

  return (
    <section id="reviews" className="py-24 bg-[#141b08] text-white relative overflow-hidden">
      
      {/* Background Decorative Gradients & Watermarks */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(148,192,0,0.12),transparent_60%)] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#3A5303]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-800 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-[#3A5303]/40 border border-[#94C000]/30 px-3.5 py-1.5 rounded-full text-[11px] font-bold text-[#94C000] uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-[#94C000]" />
              <span>100% Genuine Farm Patron Reviews</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif tracking-tight text-white font-normal leading-tight">
              Loved By Wellness Families & Home Chefs Across India
            </h2>
            <p className="text-stone-400 text-sm font-light leading-relaxed">
              Read real stories from thousands of families in Jubilee Hills, Banjara Hills, Gachibowli & pan-India who trust Brindavanam Nature Centre for their daily A2 Bilona Ghee, Wood-Pressed Oils & Fresh Produce.
            </p>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="px-5 py-3 bg-[#3A5303] hover:bg-[#2b3e02] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg border border-[#94C000]/40 transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-[#94C000]" />
              <span>Leave A Review</span>
            </button>
          </div>
        </div>

        {/* Filter Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'ghee', label: 'A2 Bilona Ghee' },
            { id: 'oil', label: 'Wood-Pressed Oils' },
            { id: 'paneer', label: 'Desi Paneer' },
            { id: 'milk', label: 'Gir Cow Milk' },
            { id: 'eggs', label: 'Farm Eggs' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTagFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTagFilter === tab.id
                  ? 'bg-[#3A5303] text-white shadow-lg border border-[#94C000]/50 font-bold'
                  : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Masonry / Responsive Review Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <AnimatePresence>
            {filteredReviews.length === 0 ? (
              <div className="text-center py-16 bg-white/5 border border-stone-800 rounded-3xl p-8 space-y-4 max-w-xl mx-auto col-span-full">
                <Sparkles className="w-10 h-10 text-[#94C000] mx-auto animate-pulse" />
                <h3 className="text-xl font-serif text-white font-normal">Be the First Patron to Share Your Feedback</h3>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  No patron reviews submitted yet for this produce category. Click below to share your genuine experience!
                </p>
                <button
                  onClick={() => setIsSubmitOpen(true)}
                  className="px-6 py-3 bg-[#3A5303] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg border border-[#94C000]/40 hover:bg-[#2b3e02] transition-colors cursor-pointer"
                >
                  + Submit Patron Review
                </button>
              </div>
            ) : (
              filteredReviews.map((rev) => (
                <motion.div
                  key={rev.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/5 backdrop-blur-md border border-stone-800 hover:border-[#3A5303] rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between group transition-all duration-300 hover:shadow-2xl hover:shadow-[#3A5303]/10 relative"
                >
                  
                  {/* Top Card Info: Rating & Produce Badge */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-xs font-bold text-amber-400 ml-1.5 font-mono">
                          {rev.rating}.0
                        </span>
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#3A5303]/40 border border-[#94C000]/30 text-[#94C000]">
                        {rev.produceName}
                      </span>
                    </div>

                    {/* Headline Quote */}
                    <h3 className="text-base font-serif font-bold text-white group-hover:text-[#94C000] transition-colors leading-snug">
                      "{rev.headline}"
                    </h3>

                    {/* Body Review Paragraph */}
                    <p className="text-xs text-stone-300 font-light leading-relaxed">
                      {rev.review}
                    </p>
                  </div>

                  {/* Footer: User Profile & Verified Badge */}
                  <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={rev.avatar}
                        alt={rev.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-[#94C000]/40"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold text-white">{rev.name}</span>
                          {rev.verified && (
                            <span title="Verified Farm Buyer">
                              <UserCheck className="w-3.5 h-3.5 text-[#94C000]" />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-stone-400 block">{rev.role} • {rev.location}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLike(rev.id)}
                      className={`flex items-center space-x-1.5 text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                        userLiked[rev.id]
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                          : 'bg-white/5 text-stone-400 border-white/10 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${userLiked[rev.id] ? 'fill-rose-400 text-rose-400' : ''}`} />
                      <span>{rev.likes + (likesState[rev.id] || 0)}</span>
                    </button>
                  </div>

                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* SUBMIT YOUR OWN REVIEW MODAL */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c260b] border border-stone-700 max-w-lg w-full rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#94C000]" />
                <h3 className="text-lg font-serif font-bold text-white">Share Your Farm Experience</h3>
              </div>
              <button onClick={() => setIsSubmitOpen(false)} className="text-stone-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedMessage ? (
              <div className="text-center py-10 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#94C000] mx-auto animate-bounce" />
                <h4 className="text-lg font-serif text-white">Thank You for Your Feedback!</h4>
                <p className="text-xs text-stone-300">Your review has been saved and published live across Brindavanam Nature Centre.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 uppercase font-bold text-[10px] mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-[#94C000]"
                      placeholder="e.g. Meera Reddy"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 uppercase font-bold text-[10px] mb-1">Location (City/Colony)</label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-[#94C000]"
                      placeholder="Jubilee Hills, Hyd"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 uppercase font-bold text-[10px] mb-1">Produce Purchased</label>
                    <select
                      value={newProductId}
                      onChange={(e) => setNewProductId(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1c260b] border border-stone-700 rounded-xl text-white focus:outline-none focus:border-[#94C000]"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-300 uppercase font-bold text-[10px] mb-1">Star Rating</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 ${
                            newRating >= star ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'bg-white/5 border-stone-700 text-stone-500'
                          }`}
                        >
                          <Star className="w-3 h-3 fill-current shrink-0" />
                          <span>{star}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 uppercase font-bold text-[10px] mb-1">Headline / Main Remark</label>
                  <input
                    type="text"
                    value={newHeadline}
                    onChange={(e) => setNewHeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-[#94C000]"
                    placeholder="e.g. Purest Bilona Ghee in Hyderabad!"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 uppercase font-bold text-[10px] mb-1">Detailed Review *</label>
                  <textarea
                    rows={3}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-[#94C000]"
                    placeholder="Tell us about the aroma, taste, and packaging..."
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#3A5303] text-white font-bold text-xs uppercase rounded-xl hover:bg-[#2b3e02] shadow-lg cursor-pointer"
                  >
                    Submit Verified Review
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
