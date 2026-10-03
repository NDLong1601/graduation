import React from 'react';
import { GRADUATION_CONFIG } from '../config';
import { sound } from '../utils/audioFx';
import { Sparkles, Calendar, MapPin, MailOpen } from 'lucide-react';

interface AccessHologramModalProps {
  isOpen: boolean;
  onEnter: () => void;
}

export const AccessHologramModal: React.FC<AccessHologramModalProps> = ({ isOpen, onEnter }) => {
  if (!isOpen) return null;

  const handleUnlock = () => {
    sound.playUnlock();
    onEnter();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      {/* Soft Ambient Gold Glow */}
      <div className="absolute w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-gradient-to-tr from-[#C5A059]/20 via-[#DFBA73]/15 to-amber-200/10 rounded-full blur-3xl pointer-events-none" />

      {/* Luxury Paper Card with Gold Frame */}
      <div className="relative w-full max-w-lg bg-[#FCFBF9] rounded-3xl p-6 sm:p-9 border border-[#C5A059]/40 shadow-2xl shadow-slate-900/15 overflow-hidden">
        {/* Decorative Golden Corner Flourishes */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#C5A059]/60 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#C5A059]/60 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#C5A059]/60 rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#C5A059]/60 rounded-br-sm pointer-events-none" />

        {/* Inner Gold Inset Border */}
        <div className="border border-[#C5A059]/25 rounded-2xl p-5 sm:p-7 text-center space-y-5">
          {/* Wax Seal Medallion */}
          <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-[#991B1B] via-[#7F1D1D] to-[#B91C1C] border-2 border-[#C5A059] text-[#FDE68A] shadow-lg shadow-red-950/30 animate-float">
            <span className="text-3xl">🎓</span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A6D3B] block">
              Thư Mời Tham Dự
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F172A] tracking-tight">
              {GRADUATION_CONFIG.event.title}
            </h1>
            <div className="pt-1">
              <p className="text-xl sm:text-2xl font-serif-luxury font-bold gold-foil-text">
                {GRADUATION_CONFIG.graduate.fullName}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                {GRADUATION_CONFIG.graduate.degree} • {GRADUATION_CONFIG.graduate.major}
              </p>
              <p className="text-xs text-slate-500">
                {GRADUATION_CONFIG.graduate.university}
              </p>
            </div>
          </div>

          {/* Event Quick Info */}
          <div className="grid grid-cols-2 gap-2 text-left bg-[#F7F4EC] p-3 rounded-xl border border-[#C5A059]/20 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span className="truncate font-medium">{GRADUATION_CONFIG.event.date.split(',')[0]} (16/10)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span className="truncate font-medium">Hà Nội</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 italic max-w-sm mx-auto leading-relaxed">
            "Sự hiện diện của người thân và bạn bè là niềm vinh hạnh to lớn cho Long trong ngày tốt nghiệp trọng đại này!"
          </p>

          {/* Open Button */}
          <div className="pt-2">
            <button
              onClick={handleUnlock}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] text-[#F3E5AB] font-semibold text-sm tracking-wider uppercase shadow-lg shadow-slate-900/15 border border-[#C5A059]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <MailOpen className="w-4 h-4 text-[#D4AF37]" />
              <span>TRÂN TRỌNG MỞ THIỆP MỜI</span>
              <Sparkles className="w-4 h-4 text-[#D4AF37] animate-spin" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
