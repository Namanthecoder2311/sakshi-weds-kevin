import React, { useState } from 'react';
import { PetalParticles } from './components/PetalParticles';
import { EnvelopeHero } from './components/EnvelopeHero';
import { NavbarAndControls } from './components/NavbarAndControls';
import { AnnouncementCard } from './components/AnnouncementCard';
import { BrotherNoteModal } from './components/BrotherNoteModal';
import { ScratchCard } from './components/ScratchCard';
import { TicTacToeGame } from './components/TicTacToeGame';
import { CountdownTimer } from './components/CountdownTimer';
import { LoveStoryTimeline } from './components/LoveStoryTimeline';
import { EventsTimeline } from './components/EventsTimeline';
import { WardrobePlanner } from './components/WardrobePlanner';
import { VenueSection } from './components/VenueSection';
import { PhotoGallery } from './components/PhotoGallery';
import { RSVPAndBlessings } from './components/RSVPAndBlessings';
import { WeddingFooter } from './components/WeddingFooter';

export const App: React.FC = () => {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FCF9F2] text-[#292524] relative selection:bg-[#D4AF37] selection:text-white">
      {/* 3D Wax Seal Envelope Hero Screen */}
      <EnvelopeHero
        isOpen={isEnvelopeOpen}
        onOpen={() => setIsEnvelopeOpen(true)}
      />

      {/* Floating Canvas Flower Petal Particles */}
      <PetalParticles />

      {/* Sticky Navbar & Controls */}
      <NavbarAndControls />

      {/* Main Wedding Invitation Content */}
      <main className="relative z-10 space-y-6">
        {/* 1. Auspicious Royal Announcement */}
        <AnnouncementCard />

        {/* 2. Special Dedication From Brother */}
        <BrotherNoteModal />

        {/* 3. Interactive Save The Date Golden Scratch Card */}
        <ScratchCard />

        {/* 4. Real-time Countdown Timer */}
        <CountdownTimer />

        {/* 5. Interactive Love Match Mini Game */}
        <TicTacToeGame />

        {/* 6. Our Love Story Milestones */}
        <LoveStoryTimeline />

        {/* 7. Wedding Festivities & Schedule */}
        <EventsTimeline />

        {/* 8. Virtual Wardrobe & Color Palette Planner */}
        <WardrobePlanner />

        {/* 9. Palace Venue, Travel & Weather Concierge */}
        <VenueSection />

        {/* 10. Pre-Wedding Photo Gallery & Lightbox */}
        <PhotoGallery />

        {/* 11. RSVP & Live Blessing Wall */}
        <RSVPAndBlessings />
      </main>

      {/* 12. Royal Footer */}
      <WeddingFooter onReopenEnvelope={() => setIsEnvelopeOpen(false)} />
    </div>
  );
};

export default App;
