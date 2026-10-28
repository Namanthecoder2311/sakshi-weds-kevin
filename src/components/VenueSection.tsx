import React from 'react';
import { MapPin, Navigation, Plane, Hotel, Sun, Compass } from 'lucide-react';
import { WEDDING_CONFIG } from '../data/weddingData';

export const VenueSection: React.FC = () => {
  return (
    <section id="venue" className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-semibold uppercase tracking-wider mb-2">
          <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
          Destination & Stay
        </div>
        <h2 className="text-3xl md:text-4xl font-serif text-[#5E0B1B] font-bold">
          The Royal Venue
        </h2>
        <p className="font-['Cormorant_Garamond'] italic text-lg text-[#78716C] mt-1 max-w-md mx-auto">
          “Set against the shimmering waters of Lake Pichola and the Aravalli hills.”
        </p>
      </div>

      {/* Main Venue Presentation Card */}
      <div className="rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-2xl bg-white mb-8">
        {/* Venue Picture Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80"
            alt="The Leela Palace Udaipur"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
            <span className="text-xs uppercase tracking-widest text-[#FDE68A] font-bold">
              Udaipur, Rajasthan
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FCF9F2]">
              {WEDDING_CONFIG.venueName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-200 mt-1 max-w-lg">
              {WEDDING_CONFIG.venueAddress}
            </p>
          </div>
        </div>

        {/* Buttons Bar */}
        <div className="p-6 bg-[#FCF9F2] flex flex-wrap items-center justify-between gap-4 border-t border-[#D4AF37]/30">
          <div className="text-xs text-[#78350F] font-medium flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#D97706]" />
            <span>Valet parking & private boat jetty transport arranged.</span>
          </div>

          <a
            href={WEDDING_CONFIG.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D97706] to-[#B45309] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
          >
            <Navigation className="w-4 h-4" />
            Get Google Maps Directions
          </a>
        </div>
      </div>

      {/* Travel & Accommodation Helper Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Flight & Travel */}
        <div className="bg-white p-5 rounded-2xl border border-[#E7E5E4] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mb-3">
              <Plane className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-[#5E0B1B] text-base mb-1">
              Nearest Airport
            </h4>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Maharana Pratap Airport (UDR), Udaipur is approx 40 minutes from the palace. Complimentary guest shuttles available upon RSVP confirmation.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] font-semibold text-[#881337]">
            Direct flights from Mumbai & Delhi
          </div>
        </div>

        {/* Hotel Stay */}
        <div className="bg-white p-5 rounded-2xl border border-[#E7E5E4] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#FFF1F2] text-[#BE123C] flex items-center justify-center mb-3">
              <Hotel className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-[#5E0B1B] text-base mb-1">
              Guest Accommodations
            </h4>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Special guest hospitality suites reserved for friends & family. Please mention the booking code when checking in.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] font-semibold text-[#B45309]">
            Code: <span className="bg-[#FEF3C7] px-2 py-0.5 rounded font-mono">SAKSHIKEVIN2027</span>
          </div>
        </div>

        {/* Weather Forecast */}
        <div className="bg-white p-5 rounded-2xl border border-[#E7E5E4] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center mb-3">
              <Sun className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-[#5E0B1B] text-base mb-1">
              February Weather
            </h4>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Mid-February in Udaipur is breathtakingly pleasant: sunny afternoons (24°C–27°C) and cool, crisp palace breezes in the evenings (12°C–14°C).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] font-semibold text-[#059669]">
            Light evening stole recommended
          </div>
        </div>
      </div>
    </section>
  );
};
