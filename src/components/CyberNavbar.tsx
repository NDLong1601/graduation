import React, { useState } from 'react';
import { sound } from '../utils/audioFx';
import { GRADUATION_CONFIG } from '../config';
import { Volume2, VolumeX, Menu, X, Sparkles, Send } from 'lucide-react';

interface CyberNavbarProps {
  onOpenInvite: () => void;
  onReplayIntro?: () => void;
}

export const CyberNavbar: React.FC<CyberNavbarProps> = ({ onOpenInvite, onReplayIntro }) => {
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
    { label: 'Sổ Lưu Bút', href: '#guestbook' },
  ];

  const handleNavClick = () => {
    sound.playClick();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#FAF8F5]/85 border-b border-[#C5A059]/20 shadow-sm shadow-slate-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Title */}
        <a
          href="#"
          onClick={() => sound.playClick()}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#0F172A] border border-[#C5A059]/40 flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition-transform">
            🎓
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif-luxury font-bold text-sm sm:text-base text-[#0F172A] tracking-tight group-hover:text-[#8A6D3B] transition-colors">
              LỄ TỐT NGHIỆP <span className="font-numeral">2026</span>
            </span>
            <span className="text-[11px] text-[#8A6D3B] font-medium tracking-wide">
              {GRADUATION_CONFIG.graduate.fullName} • Lớp <span className="font-numeral font-bold">{GRADUATION_CONFIG.graduate.classCode}</span>
            </span>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className="text-xs font-semibold text-slate-700 hover:text-[#8A6D3B] transition-colors relative py-1"
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
                ? 'bg-slate-100 border-slate-200 text-slate-500'
                : 'bg-[#F7F4EC] border-[#C5A059]/40 text-[#8A6D3B] shadow-sm'
            }`}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#C5A059]" />}
            <span className="text-[10px] font-medium hidden sm:inline">
              {isMuted ? 'Âm thanh: Tắt' : 'Âm thanh: Bật'}
            </span>
          </button>

          {/* Replay 3D Intro */}
          {onReplayIntro && (
            <button
              onClick={() => {
                sound.playClick();
                onReplayIntro();
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 border border-slate-200 text-slate-700 hover:text-[#8A6D3B] text-xs font-medium transition-all shadow-sm"
              title="Xem lại 3D Intro Quyển Kỷ Yếu Lật Trang"
            >
              <span>📖 Kỷ Yếu 3D</span>
            </button>
          )}

          {/* Re-open Invitation Card */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenInvite();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#C5A059]/40 text-[#8A6D3B] text-xs font-semibold hover:bg-[#F7F4EC] transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Thư Mời</span>
          </button>

          {/* RSVP Direct Jump */}
          <a
            href="#rsvp"
            onClick={handleNavClick}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-[#F3E5AB] border border-[#C5A059]/30 text-xs font-bold tracking-wide shadow-sm transition-transform active:scale-95"
          >
            <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>RSVP</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 md:hidden shadow-sm"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-[#FAF8F5]/98 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-[#F3EFEA] hover:text-[#8A6D3B]"
            >
              {link.label}
            </a>
          ))}
          {onReplayIntro && (
            <button
              onClick={() => {
                onReplayIntro();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-[#F3EFEA] flex items-center gap-2"
            >
              <span>🎬 Xem Lại 3D Intro</span>
            </button>
          )}
          <button
            onClick={() => {
              onOpenInvite();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#8A6D3B] hover:bg-[#F3EFEA] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>Xem lại Thư Mời</span>
          </button>
        </div>
      )}
    </header>
  );
};
