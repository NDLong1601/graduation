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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn">
      {/* Glow backgrounds */}
      <div className="absolute w-[320px] md:w-[600px] h-[320px] md:h-[600px] bg-gradient-to-tr from-cyan-500/20 via-purple-600/25 to-pink-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Cyber Card Modal */}
      <div className="relative w-full max-w-lg cyber-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
        {/* Top Cyber HUD Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span className="font-tech text-xs tracking-widest text-cyan-400">
              SECURITY_PROTOCOL // ENCRYPTED_INVITE
            </span>
          </div>
          <span className="font-mono-code text-[11px] px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
            v2026.11
          </span>
        </div>

        {/* Hologram Card Body */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/30 border border-cyan-500/40 text-cyan-300 animate-float">
            <Award className="w-12 h-12 text-cyan-400" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono-code text-purple-400 tracking-widest uppercase">
              THƯ MỜI THAM DỰ SỰ KIỆN
            </span>
            <h1 className="text-2xl sm:text-3xl font-tech font-extrabold text-white tracking-wide">
              {GRADUATION_CONFIG.event.title}
            </h1>
            <p className="text-sm font-medium text-cyan-300">
              Tân Khoa: <span className="font-bold text-white uppercase">{GRADUATION_CONFIG.graduate.fullName}</span>
            </p>
            <p className="text-xs text-slate-400">
              {GRADUATION_CONFIG.graduate.degree} • {GRADUATION_CONFIG.graduate.major}
            </p>
          </div>

          {/* Mini info badge */}
          <div className="grid grid-cols-2 gap-2 text-left bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">{GRADUATION_CONFIG.event.date.split(',')[0]} (15/11)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
              <span className="truncate">{GRADUATION_CONFIG.graduate.university}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 italic">
            "Sự hiện diện và lời chúc của bạn là niềm vinh hạnh to lớn cho mình trong ngày trọng đại này!"
          </p>

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={handleUnlock}
              className="w-full relative group overflow-hidden py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-tech font-bold text-sm tracking-wider uppercase shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-cyan-200 group-hover:rotate-45 transition-transform" />
              <span>GIẢI MÃ & MỞ THIỆP MỜI</span>
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
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
