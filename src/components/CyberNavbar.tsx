import React, { useState } from 'react';
import { sound } from '../utils/audioFx';
import { GRADUATION_CONFIG } from '../config';
import { Volume2, VolumeX, Menu, X, Sparkles, Send } from 'lucide-react';

interface CyberNavbarProps {
  onOpenInvite: () => void;
}

export const CyberNavbar: React.FC<CyberNavbarProps> = ({ onOpenInvite }) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  const navLinks = [
    { label: 'Đếm Ngược', href: '#countdown' },
    { label: 'Lịch Trình', href: '#timeline' },
    { label: 'Địa Điểm', href: '#venue' },
    { label: 'Xác Nhận (RSVP)', href: '#rsvp' },
    { label: 'Lời Chúc', href: '#guestbook' },
  ];

  const handleNavClick = () => {
    sound.playClick();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#120409]/75 border-b border-rose-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Title */}
        <a
          href="#"
          onClick={() => sound.playClick()}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-tech font-bold text-white text-sm shadow-md shadow-rose-950/50 group-hover:scale-105 transition-transform">
            🎓
          </div>
          <div className="flex flex-col text-left">
            <span className="font-tech font-bold text-xs sm:text-sm text-white tracking-wider group-hover:text-rose-300 transition-colors">
              GRADUATION_2026
            </span>
            <span className="text-[10px] font-mono-code text-rose-300">
              {GRADUATION_CONFIG.graduate.fullName}
            </span>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className="text-xs font-semibold text-rose-100/80 hover:text-rose-300 transition-colors relative py-1 hover:drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
              isMuted
                ? 'bg-rose-950/40 border-rose-900/60 text-rose-400'
                : 'bg-rose-950/80 border-rose-500/40 text-rose-300 shadow-sm shadow-rose-950/50'
            }`}
            title={isMuted ? 'Bật âm thanh hiệu ứng' : 'Tắt âm thanh hiệu ứng'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse text-amber-400" />}
            <span className="text-[10px] font-mono-code hidden sm:inline">
              {isMuted ? 'MUTED' : 'AUDIO_ON'}
            </span>
          </button>

          {/* Re-open Invitation Card */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenInvite();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs font-semibold hover:bg-amber-900/60 transition-all shadow-sm shadow-amber-950/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Thư Mời</span>
          </button>

          {/* RSVP Direct Jump */}
          <a
            href="#rsvp"
            onClick={handleNavClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold font-tech tracking-wide shadow-md shadow-rose-950/50 transition-transform active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>RSVP</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 md:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-cyan-400"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              onOpenInvite();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-purple-300 hover:bg-purple-950/50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Xem lại Thư Mời 3D</span>
          </button>
        </div>
      )}
    </header>
  );
};
