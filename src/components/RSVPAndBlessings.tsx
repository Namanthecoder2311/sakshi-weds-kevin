import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Send, Heart, Sparkles, MessageSquareHeart, CheckCircle2 } from 'lucide-react';
import { INITIAL_BLESSINGS, WEDDING_CONFIG } from '../data/weddingData';
import type { BlessingItem } from '../types/wedding';
import { royalAudio } from '../utils/audioPlayer';

export const RSVPAndBlessings: React.FC = () => {
  const [blessings, setBlessings] = useState<BlessingItem[]>(() => {
    const saved = localStorage.getItem('sakshi_kevin_blessings');
    return saved ? JSON.parse(saved) : INITIAL_BLESSINGS;
  });

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [guestCount, setGuestCount] = useState(2);
  const [dietary, setDietary] = useState<'veg' | 'jain' | 'all'>('veg');
  const [songRequest, setSongRequest] = useState('');
  const [message, setMessage] = useState('');
  const [relation, setRelation] = useState("Bride's Friend / Family");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem('sakshi_kevin_blessings', JSON.stringify(blessings));
  }, [blessings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !message.trim()) return;

    royalAudio.playWaxSealFanfare();

    const newBlessing: BlessingItem = {
      id: 'b_' + Date.now(),
      name: fullName.trim(),
      relation: relation,
      message: message.trim(),
      date: 'Just now',
      likes: 1
    };

    setBlessings([newBlessing, ...blessings]);
    setIsSubmitted(true);

    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.7 },
      colors: ['#D4AF37', '#BE123C', '#F59E0B']
    });

    // Reset fields except name
    setMessage('');
    setSongRequest('');
  };

  const handleLikeBlessing = (id: string) => {
    royalAudio.playRoyalChime(660, 0.4);
    setBlessings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, likes: b.likes + 1 } : b))
    );
  };

  return (
    <section id="rsvp" className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-semibold uppercase tracking-wider mb-2">
          <MessageSquareHeart className="w-3.5 h-3.5 text-[#BE123C]" />
          Join The Celebration
        </div>
        <h2 className="text-3xl md:text-4xl font-serif text-[#5E0B1B] font-bold">
          RSVP & Blessings Wall
        </h2>
        <p className="font-['Cormorant_Garamond'] italic text-lg text-[#78716C] mt-1 max-w-md mx-auto">
          “Your love, prayers, and presence are the greatest gifts we could ever ask for.”
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Interactive RSVP Form */}
        <div className="bg-gradient-to-b from-white to-[#FAF6ED] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/50 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-serif text-xl font-bold text-[#881337]">
              Confirm Your Presence
            </span>
          </div>

          {isSubmitted ? (
            <div className="p-6 text-center bg-[#FEF3C7]/60 rounded-2xl border border-[#FDE68A] animate-in fade-in duration-300">
              <CheckCircle2 className="w-12 h-12 text-[#15803D] mx-auto mb-2" />
              <h4 className="font-serif font-bold text-lg text-[#881337]">
                Thank You, {fullName}!
              </h4>
              <p className="font-['Cormorant_Garamond'] italic text-base text-[#78350F] mt-1">
                Your blessing has been posted to Sakshi & Kevin's wall. We cannot wait to celebrate with you!
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-4 py-1.5 rounded-full bg-[#881337] text-white text-xs font-semibold"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#78350F] uppercase tracking-wider mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma & Family"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D4AF37]/40 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-[#881337]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#78350F] uppercase tracking-wider mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D4AF37]/40 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-[#881337]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#78350F] uppercase tracking-wider mb-1">
                    Your Relation
                  </label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D4AF37]/40 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-[#881337]"
                  >
                    <option>Bride's Family</option>
                    <option>Groom's Family</option>
                    <option>Bride's Friend</option>
                    <option>Groom's Friend</option>
                    <option>Colleague & Well Wisher</option>
                  </select>
                </div>
              </div>

              {/* Attendance Toggle */}
              <div>
                <label className="block text-xs font-bold text-[#78350F] uppercase tracking-wider mb-1.5">
                  Will you be joining us in Udaipur?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttending('yes')}
                    className={`py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                      attending === 'yes'
                        ? 'bg-[#15803D] text-white shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-600'
                    }`}
                  >
                    Joyfully Attending ✨
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending('no')}
                    className={`py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                      attending === 'no'
                        ? 'bg-[#881337] text-white shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-600'
                    }`}
                  >
                    Celebrating in Spirit 🕊️
                  </button>
                </div>
              </div>

              {attending === 'yes' && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-[#78350F] uppercase tracking-wider mb-1">
                      No. of Guests
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-4 py-2 rounded-xl border border-[#D4AF37]/40 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#78350F] uppercase tracking-wider mb-1">
                      Dietary Food
                    </label>
                    <select
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value as 'veg' | 'jain' | 'all')}
                      className="w-full px-4 py-2 rounded-xl border border-[#D4AF37]/40 bg-white text-sm"
                    >
                      <option value="veg">Pure Vegetarian</option>
                      <option value="jain">Jain Vegetarian</option>
                      <option value="all">Non-Vegetarian / All</option>
                    </select>
                  </div>
                </div>
              )}

              {/* DJ Song Request */}
              <div>
                <label className="block text-xs font-bold text-[#78350F] uppercase tracking-wider mb-1">
                  🎵 Song to make you dance at Sangeet
                </label>
                <input
                  type="text"
                  value={songRequest}
                  onChange={(e) => setSongRequest(e.target.value)}
                  placeholder="e.g. Gallan Goodiyaan / London Thumakda"
                  className="w-full px-4 py-2 rounded-xl border border-[#D4AF37]/40 bg-white text-sm"
                />
              </div>

              {/* Blessing Message */}
              <div>
                <label className="block text-xs font-bold text-[#78350F] uppercase tracking-wider mb-1">
                  Your Blessing for Sakshi & Kevin *
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your heartfelt wishes, advice or blessings..."
                  className="w-full px-4 py-2 rounded-xl border border-[#D4AF37]/40 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-[#881337]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#881337] via-[#9F1239] to-[#881337] text-white font-serif font-bold text-sm tracking-wider uppercase shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Submit RSVP & Blessings
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Virtual Blessings Wall */}
        <div className="bg-gradient-to-b from-white to-[#FCF9F2] p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/50 shadow-xl max-h-[640px] flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#D4AF37]/30">
            <div>
              <h3 className="font-serif font-bold text-xl text-[#5E0B1B]">
                Blessings Wall
              </h3>
              <span className="text-xs text-[#78716C]">
                {blessings.length} warm wishes posted
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#FFF1F2] flex items-center justify-center text-[#BE123C]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Scrollable Blessings Notes */}
          <div className="overflow-y-auto space-y-4 pr-1 custom-scrollbar flex-1">
            {blessings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-white border border-[#E7E5E4] shadow-xs hover:border-[#D4AF37]/60 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h5 className="font-serif font-bold text-sm text-[#881337]">
                      {b.name}
                    </h5>
                    <span className="text-[10px] uppercase font-semibold text-[#B45309]">
                      {b.relation}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#A8A29E]">{b.date}</span>
                </div>

                <p className="font-['Cormorant_Garamond'] text-sm sm:text-base text-[#44403C] leading-relaxed italic">
                  “{b.message}”
                </p>

                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleLikeBlessing(b.id)}
                    className="inline-flex items-center gap-1 text-[11px] text-[#BE123C] hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Heart className="w-3 h-3 fill-[#BE123C]" />
                    <span>{b.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#D4AF37]/30 text-center text-xs text-[#A8A29E]">
            {WEDDING_CONFIG.weddingHashtag} • Udaipur 2027
          </div>
        </div>
      </div>
    </section>
  );
};
