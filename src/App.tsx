import React, { useState } from 'react';
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

export const App: React.FC = () => {
  const [showAccessModal, setShowAccessModal] = useState(true);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 cyber-grid relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Interactive 3D Cyber Background Canvas */}
      <ThreeCyberBackground />

      {/* 3D Glowing Ambient Orbs */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/3 w-80 h-80 bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Cyber Initial Access Hologram Modal */}
      <AccessHologramModal
        isOpen={showAccessModal}
        onEnter={() => setShowAccessModal(false)}
      />

      {/* Main Layout */}
      <CyberNavbar onOpenInvite={() => setShowAccessModal(true)} />

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
