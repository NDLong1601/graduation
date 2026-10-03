import React, { useState } from 'react';
import { CyberToGoldIntro } from './components/CyberToGoldIntro';
import { AccessHologramModal } from './components/AccessHologramModal';
import { CyberNavbar } from './components/CyberNavbar';
import { HeroSection } from './components/HeroSection';
import { CountdownSection } from './components/CountdownSection';
import { EventTimeline } from './components/EventTimeline';
import { VenueSection } from './components/VenueSection';
import { RsvpSection } from './components/RsvpSection';
import { GuestbookSection } from './components/GuestbookSection';
import { CyberFooter } from './components/CyberFooter';
import { ThreeCyberBackground } from './components/ThreeCyberBackground';
import { GoldenStardustCursor } from './components/GoldenStardustCursor';

export const App: React.FC = () => {
  // 3D Intro state (Feature #4: Cyber Matrix Terminal into 24K Gold Alchemy Shockwave)
  const [showIntro, setShowIntro] = useState(true);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: -500, y: -500 });

  const handlePointerMove = (e: React.PointerEvent) => {
    setSpotlightPos({ x: e.clientX, y: e.clientY });
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    setShowAccessModal(true);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className="min-h-screen bg-[#FAF8F5] text-slate-800 relative overflow-x-hidden selection:bg-amber-100 selection:text-amber-900"
    >
      {/* 3D Intro #4: Cyber Matrix Terminal into 24K Gold Alchemy Shockwave */}
      {showIntro && <CyberToGoldIntro onEnter={handleIntroComplete} />}

      {/* Interactive 3D Gold Leaf Flakes Background Canvas */}
      <ThreeCyberBackground />

      {/* Interactive Golden Stardust Trail Cursor (Feature 6) */}
      <GoldenStardustCursor />

      {/* Magic Golden Spotlight Following Cursor (Feature 7) */}
      <div
        className="fixed pointer-events-none z-10 w-[420px] h-[420px] rounded-full blur-[110px] bg-amber-300/12 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out hidden sm:block"
        style={{ left: `${spotlightPos.x}px`, top: `${spotlightPos.y}px` }}
      />

      {/* Soft Champagne Gold & Warm Alabaster Ambient Lights */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-amber-200/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/3 w-80 h-80 bg-stone-200/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Royal Sealed Invitation Modal with 3D Wax Seal & Calligraphy (Feature 1 & 2) */}
      <AccessHologramModal
        isOpen={showAccessModal}
        onEnter={() => setShowAccessModal(false)}
      />

      {/* Main Layout */}
      <CyberNavbar
        onOpenInvite={() => setShowAccessModal(true)}
        onReplayIntro={() => setShowIntro(true)}
      />

      <main className="relative z-10 space-y-12 sm:space-y-20">
        <HeroSection />
        <CountdownSection />
        <EventTimeline />
        <VenueSection />
        <RsvpSection />
        <GuestbookSection />
      </main>

      <CyberFooter />
    </div>
  );
};

export default App;
