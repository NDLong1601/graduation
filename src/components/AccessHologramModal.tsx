import React from 'react';
import { GRADUATION_CONFIG } from '../config';
import { sound } from '../utils/audioFx';
import { ShieldCheck, Sparkles, KeyRound, Award, Calendar, MapPin } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#120409]/85 backdrop-blur-xl animate-fadeIn">
      {/* Glow backgrounds */}
      <div className="absolute w-[320px] md:w-[600px] h-[320px] md:h-[600px] bg-gradient-to-tr from-rose-600/25 via-pink-600/25 to-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Cyber Card Modal */}
      <div className="relative w-full max-w-lg cyber-card rounded-3xl p-6 sm:p-8 border border-rose-500/30 shadow-2xl shadow-rose-950/70">
        {/* Top Cyber HUD Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-500/20 mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-400" />
            <span className="font-tech text-xs tracking-widest text-rose-300">
              INVITATION_PROTOCOL // VELVET_EDITION
            </span>
          </div>
          <span className="font-mono-code text-[11px] px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/30 text-rose-300">
            v2026.10
          </span>
        </div>

        {/* Hologram Card Body */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/40 text-rose-300 animate-float">
            <Award className="w-12 h-12 text-amber-300" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono-code text-rose-400 tracking-widest uppercase">
              THƯ MỜI THAM DỰ SỰ KIỆN
            </span>
            <h1 className="text-2xl sm:text-3xl font-tech font-extrabold text-white tracking-wide">
              {GRADUATION_CONFIG.event.title}
            </h1>
            <p className="text-sm font-medium text-amber-300">
              Tân Khoa: <span className="font-bold text-white uppercase">{GRADUATION_CONFIG.graduate.fullName}</span>
            </p>
            <p className="text-xs text-rose-200/80">
              {GRADUATION_CONFIG.graduate.degree} • {GRADUATION_CONFIG.graduate.major}
            </p>
          </div>

          {/* Mini info badge */}
          <div className="grid grid-cols-2 gap-2 text-left bg-rose-950/50 p-3 rounded-xl border border-rose-900/60 text-xs">
            <div className="flex items-center gap-2 text-rose-200">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">{GRADUATION_CONFIG.event.date.split(',')[0]} (16/10)</span>
            </div>
            <div className="flex items-center gap-2 text-rose-200">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="truncate">{GRADUATION_CONFIG.graduate.university}</span>
            </div>
          </div>

          <p className="text-xs text-rose-200/70 italic">
            "Sự hiện diện và lời chúc của bạn là niềm vinh hạnh to lớn cho mình trong ngày trọng đại này!"
          </p>

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={handleUnlock}
              className="w-full relative group overflow-hidden py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white font-tech font-bold text-sm tracking-wider uppercase shadow-lg shadow-rose-950/60 hover:shadow-rose-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-rose-200 group-hover:rotate-45 transition-transform" />
              <span>MỞ THIỆP MỜI TRÂN TRỌNG</span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            </button>
          </div>
        </div>

        {/* Footer tiny HUD info */}
        <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono-code text-slate-500">
          <span>CODE: {GRADUATION_CONFIG.graduate.studentId || 'GRADUATE_2026'}</span>
          <span>STATUS: ACCESS_GRANTED</span>
        </div>
      </div>
    </div>
  );
};
