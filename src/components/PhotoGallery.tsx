import React, { useState } from 'react';
import { Camera, Heart, X, ZoomIn } from 'lucide-react';
import { GALLERY_PHOTOS } from '../data/weddingData';
import { royalAudio } from '../utils/audioPlayer';

export const PhotoGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<typeof GALLERY_PHOTOS[0] | null>(null);
  const [likes, setLikes] = useState<Record<number, number>>({ 1: 34, 2: 42, 3: 56, 4: 61 });

  const handleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    royalAudio.playRoyalChime(700, 0.5);
    setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <section id="gallery" className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-semibold uppercase tracking-wider mb-2">
          <Camera className="w-3.5 h-3.5 text-[#D97706]" />
          Captured Moments
        </div>
        <h2 className="text-3xl md:text-4xl font-serif text-[#5E0B1B] font-bold">
          Memories in Film
        </h2>
        <p className="font-['Cormorant_Garamond'] italic text-lg text-[#78716C] mt-1">
          Tap any portrait to view in full royal resolution
        </p>
      </div>

      {/* Polaroid Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {GALLERY_PHOTOS.map((photo, idx) => (
          <div
            key={photo.id}
            onClick={() => {
              royalAudio.playRoyalChime(580, 0.5);
              setSelectedPhoto(photo);
            }}
            className={`group bg-white p-3 rounded-2xl shadow-md hover:shadow-2xl border border-[#D4AF37]/30 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
              idx % 2 === 0 ? 'rotate-[-1.5deg] hover:rotate-0' : 'rotate-[1.5deg] hover:rotate-0'
            }`}
          >
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden mb-3 bg-gray-100">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-white drop-shadow-md" />
              </div>
            </div>

            {/* Polaroid Label */}
            <div>
              <div className="text-xs font-serif font-bold text-[#5E0B1B] truncate">
                {photo.title}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[11px] text-[#78716C]">
                <span className="font-['Cormorant_Garamond'] italic truncate max-w-[90px]">
                  #SakshiKevin
                </span>
                <button
                  type="button"
                  onClick={(e) => handleLike(photo.id, e)}
                  className="flex items-center gap-1 text-[#BE123C] hover:scale-110 transition-transform cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-[#BE123C]" />
                  <span>{likes[photo.id]}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]"
          >
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[4/5] w-full bg-black">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 text-center bg-[#FCF9F2]">
              <h3 className="font-serif font-bold text-xl text-[#5E0B1B]">
                {selectedPhoto.title}
              </h3>
              <p className="font-['Cormorant_Garamond'] italic text-base text-[#78716C] mt-1">
                {selectedPhoto.caption}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleLike(selectedPhoto.id, e)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFF1F2] border border-[#FDA4AF] text-[#BE123C] text-xs font-semibold cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-[#BE123C]" />
                  <span>Send Love ({likes[selectedPhoto.id]})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
