import React from 'react';
import { GRADUATION_CONFIG } from '../config';
import { sound } from '../utils/audioFx';
import { ArrowUp, Heart, Code2 } from 'lucide-react';

export const CyberFooter: React.FC = () => {
  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-cyan-500/15 py-12 bg-slate-950/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Left Brand */}
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 font-tech font-bold text-white text-base">
              <span>🎓</span>
              <span>GRADUATION PROTOCOL // 2026</span>
            </div>
            <p className="text-xs text-slate-400">
              Thiệp mời kỷ niệm tốt nghiệp của <strong className="text-cyan-300">{GRADUATION_CONFIG.graduate.fullName}</strong>
            </p>
            <p className="text-[11px] text-slate-500 font-mono-code">
              {GRADUATION_CONFIG.graduate.university} • {GRADUATION_CONFIG.graduate.faculty}
            </p>
          </div>

          {/* Center Heart Note */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Được xây dựng với</span>
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500 animate-pulse" />
            <span>và niềm hân hoan tốt nghiệp</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <div className="text-[11px] font-mono-code text-cyan-400/80 bg-cyan-950/50 px-3 py-1.5 rounded-lg border border-cyan-500/20 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>READY FOR GITHUB PAGES</span>
            </div>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all shadow-md"
              title="Cuộn lên đầu trang"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
