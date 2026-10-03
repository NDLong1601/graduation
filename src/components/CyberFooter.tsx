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
    <footer className="border-t border-rose-500/20 py-12 bg-[#120409]/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Left Brand */}
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 font-tech font-bold text-white text-base">
              <span>🎓</span>
              <span>GRADUATION PROTOCOL // 2026</span>
            </div>
            <p className="text-xs text-rose-200/80">
              Thiệp mời kỷ niệm tốt nghiệp của <strong className="text-amber-300">{GRADUATION_CONFIG.graduate.fullName}</strong>
            </p>
            <p className="text-[11px] text-rose-300/60 font-mono-code">
              {GRADUATION_CONFIG.graduate.university}
              {GRADUATION_CONFIG.graduate.faculty ? ` • ${GRADUATION_CONFIG.graduate.faculty}` : ''}
            </p>
          </div>

          {/* Center Heart Note */}
          <div className="flex items-center gap-1.5 text-xs text-rose-200/80">
            <span>Được xây dựng với</span>
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
            <span>và niềm hân hoan tốt nghiệp</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <div className="text-[11px] font-mono-code text-rose-300/90 bg-rose-950/60 px-3 py-1.5 rounded-lg border border-rose-500/30 flex items-center gap-1.5 shadow-sm">
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>READY FOR GITHUB PAGES</span>
            </div>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800/60 text-rose-200 hover:text-white transition-all shadow-md"
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
