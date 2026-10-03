import React from 'react';
import { GRADUATION_CONFIG } from '../config';
import { sound } from '../utils/audioFx';
import { ArrowUp, Heart } from 'lucide-react';

export const CyberFooter: React.FC = () => {
  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-amber-200/70 py-12 bg-white/70 backdrop-blur-md relative mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Left Brand */}
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 font-serif-luxury font-bold text-slate-900 text-lg">
              <span>🎓</span>
              <span>LỄ TỐT NGHIỆP • <span className="font-numeral font-bold">2026</span></span>
            </div>
            <p className="text-xs text-slate-600">
              Thiệp mời kỷ niệm tốt nghiệp của <strong className="text-amber-800 font-semibold">{GRADUATION_CONFIG.graduate.fullName}</strong>
            </p>
            <p className="text-[11px] text-slate-500 font-sans">
              Lớp <strong className="font-numeral text-slate-700">{GRADUATION_CONFIG.graduate.classCode}</strong> • {GRADUATION_CONFIG.graduate.faculty} • {GRADUATION_CONFIG.graduate.university}
            </p>
          </div>

          {/* Center Heart Note */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <span>Rất hân hạnh được đón tiếp bạn</span>
            <Heart className="w-4 h-4 text-amber-600 fill-amber-600" />
            <span>trong ngày trọng đại này</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <div className="text-[11px] font-sans text-amber-900 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 shadow-sm">
              <span>Hân hoan chào đón quý khách</span>
            </div>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-white hover:bg-amber-50 border border-amber-200 text-slate-700 hover:text-amber-900 transition-all shadow-sm"
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
