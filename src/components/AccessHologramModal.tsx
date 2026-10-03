import React, { useState } from 'react';
import { GRADUATION_CONFIG } from '../config';
import { sound } from '../utils/audioFx';
import confetti from 'canvas-confetti';
import { Sparkles, Calendar, MapPin, ArrowRight } from 'lucide-react';

interface AccessHologramModalProps {
  isOpen: boolean;
  onEnter: () => void;
}

export const AccessHologramModal: React.FC<AccessHologramModalProps> = ({ isOpen, onEnter }) => {
  const [isBroken, setIsBroken] = useState(false);
  const [isUnfolded, setIsUnfolded] = useState(false);

  if (!isOpen) return null;

  const handleBreakSeal = () => {
    if (isBroken) return;
    setIsBroken(true);
    sound.playWaxSealBreak();

    // Burst gold micro-sparks on breaking seal
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.52 },
      colors: ['#D4AF37', '#991B1B', '#F3E5AB', '#FFFFFF'],
    });

    // Envelope unfolding sequence
    setTimeout(() => {
      setIsUnfolded(true);
    }, 450);
  };

  const handleEnterSite = () => {
    sound.playUnlock();
    onEnter();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      {/* Soft Ambient Gold Glow */}
      <div className="absolute w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-gradient-to-tr from-[#C5A059]/25 via-[#DFBA73]/15 to-amber-200/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main 3D Envelope Container */}
      <div className="relative w-full max-w-xl perspective-[1200px]">
        {/* Envelope Body */}
        <div
          className={`relative w-full rounded-3xl transition-all duration-700 ${
            isUnfolded ? 'shadow-2xl shadow-slate-950/40' : 'shadow-xl shadow-slate-900/30'
          }`}
        >
          {/* STATE 1: SEALED ENVELOPE (Chưa mở sáp) */}
          {!isUnfolded ? (
            <div className="relative bg-[#F9F7F2] rounded-3xl p-8 sm:p-12 border-2 border-[#C5A059]/40 text-center overflow-hidden">
              {/* Corner Ornaments */}
              <div className="absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-[#C5A059]/70 rounded-tl-sm pointer-events-none" />
              <div className="absolute top-3 right-3 w-7 h-7 border-t-2 border-r-2 border-[#C5A059]/70 rounded-tr-sm pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-7 h-7 border-b-2 border-l-2 border-[#C5A059]/70 rounded-bl-sm pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-[#C5A059]/70 rounded-br-sm pointer-events-none" />

              {/* Envelope Triangular Fold Lines Simulation */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polygon points="0,0 50,48 100,0" fill="#EADBC8" />
                  <polygon points="0,0 0,100 48,50" fill="#E2D0B8" />
                  <polygon points="100,0 100,100 52,50" fill="#E2D0B8" />
                </svg>
              </div>

              {/* Top Invitation Tag */}
              <div className="relative z-10 mb-8 space-y-1">
                <span className="text-[11px] font-sans font-bold uppercase tracking-[0.25em] text-[#8A6D3B]">
                  THƯ MỜI DANH DỰ
                </span>
                <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#0F172A]">
                  Lễ Tốt Nghiệp Khóa <span className="font-numeral">27</span>
                </h2>
                <p className="text-xs text-slate-500 font-sans">
                  Khoa Công nghệ Thông tin • HUBT
                </p>
              </div>

              {/* Central Crimson Wax Seal Button */}
              <div className="relative z-20 my-6 flex flex-col items-center justify-center">
                <button
                  type="button"
                  onClick={handleBreakSeal}
                  className={`group relative p-6 sm:p-7 rounded-full bg-gradient-to-br from-[#800F15] via-[#A81D24] to-[#60080D] border-4 border-[#D4AF37] shadow-2xl shadow-red-950/60 cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
                    isBroken ? 'animate-wax-break pointer-events-none' : 'animate-float'
                  }`}
                  title="Chạm vào con dấu sáp để mở thư"
                >
                  {/* Wax Seal Outer Ring */}
                  <div className="absolute inset-1 rounded-full border border-dashed border-[#F3E5AB]/40 pointer-events-none" />

                  {/* Embossed Wax Seal Icon & Text */}
                  <div className="flex flex-col items-center justify-center text-[#FDE68A]">
                    <span className="text-3xl sm:text-4xl filter drop-shadow">🎓</span>
                    <span className="text-[10px] font-numeral font-bold tracking-widest mt-1 text-[#FCE788]">
                      HUBT • K27
                    </span>
                  </div>

                  {/* Pulsing Glow Ring */}
                  <span className="absolute -inset-2 rounded-full border-2 border-[#D4AF37]/50 animate-ping pointer-events-none" />
                </button>

                {/* Interactive Click Instruction */}
                <div className="mt-6 flex items-center gap-1.5 text-xs text-[#8A6D3B] font-medium bg-[#F3EFEA] px-4 py-1.5 rounded-full border border-[#C5A059]/30 shadow-sm animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Chạm vào con dấu sáp đỏ để mở thiệp</span>
                </div>
              </div>

              {/* Footer Note */}
              <div className="relative z-10 pt-4 text-[11px] text-slate-500 italic">
                Dành tặng quý người thân, thầy cô & bạn bè thân thương
              </div>
            </div>
          ) : (
            /* STATE 2: UNFOLDED PARCHMENT INVITATION LETTER */
            <div className="relative bg-[#FCFBF9] rounded-3xl p-6 sm:p-10 border border-[#C5A059]/40 text-center animate-letter-rise overflow-hidden">
              {/* Golden Corner Flourishes */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#C5A059]/70 rounded-tl-sm pointer-events-none" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#C5A059]/70 rounded-tr-sm pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#C5A059]/70 rounded-bl-sm pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#C5A059]/70 rounded-br-sm pointer-events-none" />

              {/* Inner Inset Border */}
              <div className="border border-[#C5A059]/30 rounded-2xl p-5 sm:p-7 space-y-5">
                {/* Top Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F7F4EC] border border-[#C5A059]/35 text-xs text-[#8A6D3B] font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="tracking-widest uppercase">THƯ MỜI CHÍNH THỨC</span>
                </div>

                {/* Calligraphy Title with SVG Hand-drawn effect */}
                <div className="space-y-1">
                  <div className="h-10 flex items-center justify-center">
                    <svg viewBox="0 0 300 45" className="w-64 h-10 overflow-visible">
                      <text
                        x="50%"
                        y="32"
                        textAnchor="middle"
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="1.2"
                        className="font-serif-luxury text-2xl font-bold calligraphy-stroke"
                      >
                        Thư Mời Tốt Nghiệp
                      </text>
                      <text
                        x="50%"
                        y="32"
                        textAnchor="middle"
                        fill="url(#goldGradModal)"
                        className="font-serif-luxury text-2xl font-bold transition-opacity duration-1000"
                      >
                        Thư Mời Tốt Nghiệp
                      </text>
                      <defs>
                        <linearGradient id="goldGradModal" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#9A7B38" />
                          <stop offset="50%" stopColor="#D4AF37" />
                          <stop offset="100%" stopColor="#8A6D3B" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#0F172A] pt-1">
                    {GRADUATION_CONFIG.event.title}
                  </h3>
                </div>

                {/* Graduate Identity Info */}
                <div className="pt-1 pb-2">
                  <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold gold-foil-text tracking-wide">
                    {GRADUATION_CONFIG.graduate.fullName}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
                    {GRADUATION_CONFIG.graduate.degree} • Lớp <span className="font-numeral font-bold text-[#8A6D3B]">{GRADUATION_CONFIG.graduate.classCode}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {GRADUATION_CONFIG.graduate.faculty} • {GRADUATION_CONFIG.graduate.university}
                  </p>
                </div>

                {/* Event Highlights Quick Bar */}
                <div className="grid grid-cols-2 gap-2 text-left bg-[#F7F4EC] p-3.5 rounded-xl border border-[#C5A059]/25 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span className="truncate font-sans font-medium">
                      <span className="font-numeral font-bold">13h00</span> • <span className="font-numeral font-bold">16/10/2026</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span className="truncate font-medium">{GRADUATION_CONFIG.event.hall}</span>
                  </div>
                </div>

                {/* Authentic Faculty Quote */}
                <p className="text-xs sm:text-sm text-slate-600 italic max-w-md mx-auto leading-relaxed pt-1">
                  "Thanh xuân có bạn thật đẹp! ♡ Khép lại một hành trình – Mở ra một tương lai!"
                </p>

                {/* Enter Button */}
                <div className="pt-2">
                  <button
                    onClick={handleEnterSite}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] hover:from-[#1E293B] hover:to-[#334155] text-[#F3E5AB] font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-xl shadow-slate-900/20 border border-[#C5A059]/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <span>TRÂN TRỌNG BƯỚC VÀO BUỔI LỄ</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
