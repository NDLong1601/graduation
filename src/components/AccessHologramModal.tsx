import React, { useState } from 'react';
import { GRADUATION_CONFIG } from '../config';
import { sound } from '../utils/audioFx';
import confetti from 'canvas-confetti';
import { Sparkles, Calendar, MapPin, ArrowRight, RotateCcw } from 'lucide-react';

interface AccessHologramModalProps {
  isOpen: boolean;
  onEnter: () => void;
}

type EnvelopeStage = 'sealed' | 'breaking' | 'opening' | 'unfolded';

export const AccessHologramModal: React.FC<AccessHologramModalProps> = ({ isOpen, onEnter }) => {
  const [stage, setStage] = useState<EnvelopeStage>('sealed');

  if (!isOpen) return null;

  const handleBreakSeal = () => {
    if (stage !== 'sealed') return;
    setStage('breaking');
    sound.playWaxSealBreak();

    // Burst gold micro-sparks on breaking seal
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.52 },
      colors: ['#D4AF37', '#991B1B', '#F3E5AB', '#FFFFFF'],
    });

    // Step 2: Open top flap in 3D & extract letter
    setTimeout(() => {
      setStage('opening');
      sound.playPaperPlaneWhoosh();
    }, 350);

    // Step 3: Unfold full invitation parchment
    setTimeout(() => {
      setStage('unfolded');
    }, 1300);
  };

  const handleReplay = () => {
    sound.playClick();
    setStage('sealed');
  };

  const handleEnterSite = () => {
    sound.playUnlock();
    onEnter();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      {/* Soft Ambient Gold Glow */}
      <div className="absolute w-[350px] md:w-[650px] h-[350px] md:h-[650px] bg-gradient-to-tr from-[#C5A059]/30 via-[#DFBA73]/20 to-amber-200/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-xl mx-auto">
        {stage !== 'unfolded' ? (
          /* ============================================================ */
          /* STAGE 1: PHYSICAL 3D LAYERED ENVELOPE (PHONG THƯ HOÀNG GIA)  */
          /* ============================================================ */
          <div className="relative w-full aspect-[16/11] max-h-[390px] select-none perspective-[1400px]">
            {/* Envelope Shell Container */}
            <div className="relative w-full h-full rounded-2xl bg-[#EFE9DC] shadow-2xl shadow-slate-950/50 border-2 border-[#C5A059]/40 overflow-hidden transform-gpu">
              {/* 1. Envelope Back Lining (Warm Cream Parchment with Gold Hue) */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#F9F6EE] via-[#EFE7D8] to-[#E3D6C2] p-4 flex flex-col items-center justify-start text-center">
                <div className="w-full h-full border border-dashed border-[#C5A059]/30 rounded-xl flex items-center justify-center">
                  <span className="text-[11px] font-serif-luxury text-[#8A6D3B]/40 uppercase tracking-widest">
                    HUBT GRADUATION 2026
                  </span>
                </div>
              </div>

              {/* 2. The Letter Inside Pocket (Physically slides up when opening) */}
              <div
                className={`absolute inset-x-6 top-6 h-[86%] bg-[#FCFBF8] rounded-xl border border-[#C5A059]/50 shadow-md p-4 text-center transition-all duration-700 ease-out z-10 ${
                  stage === 'opening'
                    ? '-translate-y-28 scale-[1.03] shadow-2xl z-30'
                    : 'translate-y-0'
                }`}
              >
                <div className="border border-[#C5A059]/30 rounded-lg p-3 h-full flex flex-col items-center justify-center">
                  <span className="text-[10px] font-sans font-bold tracking-widest text-[#8A6D3B] uppercase">
                    THƯ MỜI CHÍNH THỨC
                  </span>
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F172A] mt-1">
                    {GRADUATION_CONFIG.graduate.fullName}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {GRADUATION_CONFIG.graduate.degree} • Lớp {GRADUATION_CONFIG.graduate.classCode}
                  </p>
                  <span className="mt-2 text-[10px] text-[#8A6D3B] italic">
                    {stage === 'opening' ? 'Đang mở bức thư...' : 'Niêm phong hoàng gia'}
                  </span>
                </div>
              </div>

              {/* 3. Lower Pocket Flaps (Left, Right, Bottom triangular pocket) */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  {/* Left Flap */}
                  <polygon points="0,0 48,52 0,100" fill="#F4EDE1" stroke="#DACBB7" strokeWidth="0.6" />
                  {/* Right Flap */}
                  <polygon points="100,0 52,52 100,100" fill="#F4EDE1" stroke="#DACBB7" strokeWidth="0.6" />
                  {/* Bottom Pocket Flap */}
                  <polygon points="0,100 50,48 100,100" fill="#EAE0D0" stroke="#DACBB7" strokeWidth="0.6" />
                </svg>
                {/* Gold Seal Monogram on pocket */}
                <div className="absolute bottom-2.5 inset-x-0 flex justify-center">
                  <span className="text-[10px] font-numeral font-bold text-[#8A6D3B]/70 tracking-widest">
                    HUBT • K27
                  </span>
                </div>
              </div>

              {/* 4. Top Triangular Flap (Swings open 180° in 3D when opening) */}
              <div
                className={`absolute top-0 inset-x-0 h-[54%] origin-top transition-transform duration-700 ease-in-out z-30 ${
                  stage === 'opening' ? 'rotate-x-180 -z-0 opacity-0' : 'rotate-x-0'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: stage === 'opening' ? 'rotateX(180deg)' : 'rotateX(0deg)',
                }}
              >
                <svg className="w-full h-full drop-shadow-md" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polygon points="0,0 100,0 50,100" fill="#F7F1E6" stroke="#D8C8B4" strokeWidth="0.6" />
                  {/* Gold Accent Chevron Line */}
                  <polyline points="4,2 50,94 96,2" fill="none" stroke="#C5A059" strokeWidth="0.8" opacity="0.6" />
                </svg>
              </div>

              {/* 5. Central Crimson Wax Seal Button */}
              {stage !== 'opening' && (
                <div className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={handleBreakSeal}
                    disabled={stage === 'breaking'}
                    className={`group relative p-6 sm:p-7 rounded-full bg-gradient-to-br from-[#800F15] via-[#A81D24] to-[#5C080E] border-4 border-[#D4AF37] shadow-2xl shadow-red-950/70 cursor-pointer transition-transform hover:scale-110 active:scale-95 ${
                      stage === 'breaking' ? 'animate-wax-shatter pointer-events-none' : 'animate-float'
                    }`}
                    title="Chạm vào con dấu sáp để mở thiệp"
                  >
                    {/* Inner Dashed Gold Border */}
                    <div className="absolute inset-1 rounded-full border border-dashed border-[#F3E5AB]/50 pointer-events-none" />

                    {/* Embossed Wax Seal Icon & Text */}
                    <div className="flex flex-col items-center justify-center text-[#FDE68A]">
                      <span className="text-3xl sm:text-4xl filter drop-shadow">🎓</span>
                      <span className="text-[10px] font-numeral font-bold tracking-widest mt-1 text-[#FCE788]">
                        HUBT • K27
                      </span>
                    </div>

                    {/* Pulsing Outer Halo Ring */}
                    <span className="absolute -inset-2.5 rounded-full border-2 border-[#D4AF37]/60 animate-ping pointer-events-none" />
                  </button>

                  {/* Floating Click Instruction */}
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-[#8A6D3B] font-medium bg-[#FBF9F5] px-4 py-1.5 rounded-full border border-[#C5A059]/40 shadow-sm animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Chạm vào con dấu sáp để mở thiệp</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* STAGE 2: UNFOLDED PARCHMENT INVITATION LETTER (THIỆP HOÀNG GIA)*/
          /* ============================================================ */
          <div className="relative bg-[#FCFBF9] rounded-3xl p-6 sm:p-10 border border-[#C5A059]/40 text-center animate-letter-full shadow-2xl shadow-slate-950/40 overflow-hidden">
            {/* Golden Corner Flourishes */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#C5A059]/70 rounded-tl-sm pointer-events-none" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#C5A059]/70 rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#C5A059]/70 rounded-bl-sm pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#C5A059]/70 rounded-br-sm pointer-events-none" />

            {/* Replay Button (Top Right) */}
            <button
              onClick={handleReplay}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#F5EFE4] hover:bg-[#EADBCA] text-[#8A6D3B] border border-[#C5A059]/30 transition-all text-xs flex items-center gap-1"
              title="Xem lại hiệu ứng mở phong bì"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[10px] font-medium">Mở lại</span>
            </button>

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
                  {GRADUATION_CONFIG.graduate.degree} • Lớp{' '}
                  <span className="font-numeral font-bold text-[#8A6D3B]">
                    {GRADUATION_CONFIG.graduate.classCode}
                  </span>
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
                    <span className="font-numeral font-bold">13h00</span> •{' '}
                    <span className="font-numeral font-bold">16/10/2026</span>
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
  );
};
