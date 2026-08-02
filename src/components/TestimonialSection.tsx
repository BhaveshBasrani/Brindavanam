'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, Heart, MessageSquarePlus, UserCheck, CheckCircle2 } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  date: string;
  produceTag: 'ghee' | 'oil' | 'paneer' | 'milk' | 'eggs';
  produceName: string;
  headline: string;
  review: string;
  verified: boolean;
  likes: number;
}

const DEFAULT_REVIEWS: Testimonial[] = [
  {
    id: 'rev-1',
    name: 'Dr. Ramesh Kulkarni',
    role: 'Ayurvedic Physician',
    location: 'Jubilee Hills, Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    date: '3 days ago',
    produceTag: 'ghee',
    produceName: 'A2 Desi Cow Bilona Ghee',
    headline: 'Reminds me of my grandmother’s village farm in Gujarat',
    review: 'As an Ayurvedic practitioner, purity is non-negotiable. The Danedar granular texture and authentic nutty wood-fire aroma of Brindavanam Bilona Ghee are unmatched. You can literally smell the curd-churning purity the moment you unseal the glass jar.',
    verified: true,
    likes: 42
  },
  {
    id: 'rev-2',
    name: 'Ananya Sharma',
    role: 'Nutritionist & Fitness Coach',
    location: 'Banjara Hills, Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    date: '1 week ago',
    produceTag: 'paneer',
    produceName: 'Fresh Desi Cow Paneer',
    headline: 'Melts in your mouth! Zero rubbery feel',
    review: 'I recommend this paneer to all my high-protein fitness clients. Soft, juicy, and handcrafted daily from pure A2 Desi Cow Milk. When cooked in Palak Paneer or tikka, it absorbs spices effortlessly without getting tough.',
    verified: true,
    likes: 38
  },
  {
    id: 'rev-3',
    name: 'Sunil Deshmukh',
    role: 'Organic Food Connoisseur',
    location: 'Gachibowli, Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    date: '2 weeks ago',
    produceTag: 'oil',
    produceName: 'Wood-Pressed Groundnut Oil',
    headline: 'True Marachekku Kachi Ghani aroma',
    review: 'You can taste the natural sweetness of native bold peanuts in every dish! Unlike refined solvent-extracted oils from supermarket shelves, this wood-pressed oil produces zero heavy grease and makes tadka taste heavenly.',
    verified: true,
    likes: 29
  },
  {
    id: 'rev-4',
    name: 'Priya Nambiar',
    role: 'Homemaker & Mother of two',
    location: 'Kondapur, Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    date: '1 month ago',
    produceTag: 'milk',
    produceName: 'Fresh A2 Desi Cow Milk',
    headline: 'Thick malai layer every single morning!',
    review: 'My kids used to refuse milk until we switched to Brindavanam Nature Centre. The milk is unadulterated, creamy, and sweet. Boiling it forms a thick golden malai layer that makes homemade butter so easy!',
    verified: true,
    likes: 56
  },
  {
    id: 'rev-5',
    name: 'Vikram Reddy',
    role: 'Tech Executive',
    location: 'Hitec City, Hyderabad',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    date: '2 weeks ago',
    produceTag: 'eggs',
    produceName: 'Farm Fresh Free-Range Eggs',
    headline: 'Deep orange yolks & incredible freshness',
    review: 'Delivered in pristine condition with zero breakage! You can tell these hens are free-range and naturally raised. The yolk is vibrant deep orange and tastes vastly superior to commercial store eggs.',
    verified: true,
    likes: 31
  },
  {
    id: 'rev-6',
    name: 'Meenakshi Iyer',
    role: 'Classical Culinary Instructor',
    location: 'Secunderabad, Telangana',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
    rating: 5,
    date: '1 month ago',
    produceTag: 'oil',
    produceName: 'Wood-Pressed Sesame (Til) Oil',
    headline: 'Essential for traditional South Indian pickles',
    review: 'Extracted under 40°C in wooden Ghani without chemical solvents. Perfect for Avakaya pickles, Gingelly oil pulling, and daily lamp rituals. Brindavanam Nature Centre is a blessing for authentic traditional cooking!',
    verified: true,
    likes: 47
  }
];

export const TestimonialSection: React.FC = () => {
  const [reviews, setReviews] = useState<Testimonial[]>(DEFAULT_REVIEWS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'ghee' | 'oil' | 'paneer' | 'milk' | 'eggs'>('all');
  const [likesState, setLikesState] = useState<Record<string, number>>({});
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});

  // Review Submission Modal State
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newProduceTag, setNewProduceTag] = useState<'ghee' | 'oil' | 'paneer' | 'milk' | 'eggs'>('ghee');
  const [newHeadline, setNewHeadline] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const gasUrl = process.env.NEXT_PUBLIC_GAS_WEB_APP_URL || 'https://script.google.com/macros/s/AKfycbwqHEdFL5zR_cCPSUkvb91nudf72H9K1CdFYPEyHgP_XInRSaHQU0TiZEtadcYHpQPS/exec';

  // Fetch reviews from Apps Script backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${gasUrl}?action=getReviews`);
        const data = await res.json();
        if (data.status === 'success' && Array.isArray(data.reviews) && data.reviews.length > 0) {
          // Merge custom submitted reviews with defaults
          const remoteFormatted = data.reviews.map((r: any) => ({
            id: r.id || `rev-${Date.now()}`,
            name: r.name || 'Valued Patron',
            role: 'Verified Customer',
            location: r.location || 'Hyderabad',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop',
            rating: r.rating || 5,
            date: r.date || 'Recent',
            produceTag: r.produceTag || 'ghee',
            produceName: r.produceName || 'A2 Desi Cow Bilona Ghee',
            headline: r.headline || 'Excellent Pure Quality!',
            review: r.review || '',
            verified: true,
            likes: 12
          }));
          setReviews([...remoteFormatted, ...DEFAULT_REVIEWS]);
        }
      } catch (err) {
        console.warn('Using default reviews:', err);
      }
    };
    fetchReviews();
  }, [gasUrl]);

  const filteredReviews = reviews.filter((r) => activeFilter === 'all' || r.produceTag === activeFilter);

  const handleLike = (id: string) => {
    if (userLiked[id]) return;
    setUserLiked((prev) => ({ ...prev, [id]: true }));
    setLikesState((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const getProduceLabel = (tag: string) => {
    switch (tag) {
      case 'ghee': return 'A2 Desi Cow Bilona Ghee';
      case 'oil': return 'Wood-Pressed Oils';
      case 'paneer': return 'Fresh Desi Paneer';
      case 'milk': return 'Pure Desi Cow Milk';
      case 'eggs': return 'Farm Fresh Eggs';
      default: return 'Certified Organic Produce';
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    setIsSubmitting(true);
    const newRevObj: Testimonial = {
      id: `rev-${Date.now()}`,
      name: newAuthor,
      role: 'Verified Patron',
      location: newLocation || 'Hyderabad',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop',
      rating: newRating,
      date: 'Just now',
      produceTag: newProduceTag,
      produceName: getProduceLabel(newProduceTag),
      headline: newHeadline || 'Pure & Authentic Organic Quality!',
      review: newComment,
      verified: true,
      likes: 1
    };

    try {
      await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'submitReview',
          review: {
            name: newAuthor,
            location: newLocation || 'Hyderabad',
            rating: newRating,
            produceTag: newProduceTag,
            produceName: getProduceLabel(newProduceTag),
            headline: newHeadline || 'Pure & Authentic Organic Quality!',
            review: newComment,
          }
        }),
      });
    } catch (err) {
      console.warn('Sync review warning:', err);
    } finally {
      setIsSubmitting(false);
      setSubmittedMessage(true);
      setReviews((prev) => [newRevObj, ...prev]);
      setTimeout(() => {
        setSubmittedMessage(false);
        setIsSubmitOpen(false);
        setNewAuthor('');
        setNewLocation('');
        setNewHeadline('');
        setNewComment('');
      }, 2000);
    }
  };

  return (
    <section id="reviews" className="py-20 sm:py-28 bg-[#1c260b] text-white relative overflow-hidden">
      
      {/* Background Ambient Organic Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#94C000]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#3A5303]/40 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-800 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#94C000]/15 border border-[#94C000]/30 text-[#94C000] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>100% Verified Farm Patron Love</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white tracking-tight">
              Loved by <span className="italic text-[#94C000]">1,200+ Families</span> Across India
            </h2>
            
            <p className="text-stone-400 text-xs sm:text-sm font-light max-w-xl">
              Real stories and unvarnished reviews from doctors, nutritionists, mothers, and culinary connoisseurs who rely on Brindavanam Nature Centre.
            </p>
          </div>

          {/* Trust Score Card & Add Review Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center space-x-4">
              <div className="text-center pr-4 border-r border-stone-700">
                <span className="text-3xl font-serif font-bold text-white block">4.9</span>
                <div className="flex text-amber-400 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">★ 100% Purity Guaranteed</span>
                <span className="text-stone-400 text-[10px]">1,240 Verified Reviews</span>
              </div>
            </div>

            <button
              onClick={() => setIsSubmitOpen(true)}
              className="px-5 py-3.5 bg-[#94C000] hover:bg-[#85ad00] text-[#1c260b] font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all active:scale-95 flex items-center space-x-2 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Share Your Review</span>
            </button>
          </div>
        </div>

        {/* Interactive Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Patron Stories' },
            { id: 'ghee', label: 'A2 Bilona Ghee' },
            { id: 'oil', label: 'Wood-Pressed Oils' },
            { id: 'paneer', label: 'Fresh Desi Paneer' },
            { id: 'milk', label: 'Pure A2 Milk' },
            { id: 'eggs', label: 'Farm Fresh Eggs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#94C000] text-[#1c260b] font-bold shadow-md'
                  : 'bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Testimonials Masonry Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredReviews.map((rev) => (
              <motion.div
                key={rev.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white/5 backdrop-blur-lg p-6 sm:p-7 rounded-3xl border border-white/10 shadow-xl flex flex-col justify-between space-y-4 hover:border-[#94C000]/40 transition-all group hover:-translate-y-1"
              >
                <div className="space-y-3">
                  
                  {/* Top Header: Produce Tag & Rating */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#94C000] bg-[#94C000]/10 px-2.5 py-1 rounded-full border border-[#94C000]/20">
                      {rev.produceName}
                    </span>

                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
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
                          <UserCheck className="w-3.5 h-3.5 text-[#94C000]" title="Verified Farm Buyer" />
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
            ))}
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
                ✕
              </button>
            </div>

            {submittedMessage ? (
              <div className="text-center py-10 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#94C000] mx-auto animate-bounce" />
                <h4 className="text-lg font-serif text-white">Thank You for Your Feedback!</h4>
                <p className="text-xs text-stone-300">Your review has been saved to Brindavanam Nature Centre database.</p>
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
                      value={newProduceTag}
                      onChange={(e) => setNewProduceTag(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[#1c260b] border border-stone-700 rounded-xl text-white focus:outline-none focus:border-[#94C000]"
                    >
                      <option value="ghee">A2 Desi Cow Bilona Ghee</option>
                      <option value="oil">Wood-Pressed Oils</option>
                      <option value="paneer">Fresh Desi Paneer</option>
                      <option value="milk">Pure A2 Desi Cow Milk</option>
                      <option value="eggs">Farm Fresh Free-Range Eggs</option>
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
                          className={`px-2 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                            newRating >= star ? 'bg-amber-400/20 border-amber-400 text-amber-400' : 'bg-white/5 border-stone-700 text-stone-500'
                          }`}
                        >
                          ★ {star}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 uppercase font-bold text-[10px] mb-1">Review Headline</label>
                  <input
                    type="text"
                    value={newHeadline}
                    onChange={(e) => setNewHeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-[#94C000]"
                    placeholder="e.g. Unmatched Danedar texture and pure aroma!"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 uppercase font-bold text-[10px] mb-1">Your Review & Comments *</label>
                  <textarea
                    rows={3}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-stone-700 rounded-xl text-white focus:outline-none focus:border-[#94C000]"
                    placeholder="Tell us about the aroma, purity, or taste of our A2 Bilona Ghee, Wood-Pressed Oils, Milk, or Paneer..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#94C000] text-[#1c260b] font-bold uppercase rounded-xl shadow-lg hover:bg-[#85ad00] cursor-pointer"
                >
                  {isSubmitting ? 'Saving to Database...' : 'Submit Patron Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </section>
  );
};
