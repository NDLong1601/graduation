import React from 'react';
import { GRADUATION_CONFIG } from '../config';
import { ThreeGraduationScene } from './ThreeGraduationScene';
import { LuxuryTiltCard } from './LuxuryTiltCard';
import { sound } from '../utils/audioFx';
import { Award, Calendar, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-6 pb-16 overflow-hidden">
      {/* Background Soft Golden Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-[#C5A059]/10 via-[#F3E5AB]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Hero Text & Call To Actions */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            {/* Top Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F7F4EC] border border-[#C5A059]/40 text-xs font-semibold text-[#8A6D3B] backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-ping" />
              <span className="tracking-wider uppercase">LỄ TỐT NGHIỆP CỬ NHÂN / KỸ SƯ</span>
            </div>

            {/* Main Headings */}
            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-semibold text-[#8A6D3B] tracking-[0.2em] uppercase">
                TRÂN TRỌNG KÍNH MỜI
              </p>
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-serif-luxury font-bold tracking-tight text-[#0F172A] leading-tight">
                <span className="block text-slate-800">Lễ Trao Bằng</span>
                <span className="gold-foil-text block mt-1">
                  Tốt Nghiệp <span className="font-numeral inline-block font-bold tracking-tight">2026</span>
                </span>
              </h1>
              <div className="pt-2">
                <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F172A]">
                  {GRADUATION_CONFIG.graduate.fullName}
                </h2>
                <p className="text-sm sm:text-base text-slate-700 font-medium mt-1">
                  {GRADUATION_CONFIG.graduate.degree} • Lớp <span className="font-numeral font-bold text-[#8A6D3B]">{GRADUATION_CONFIG.graduate.classCode}</span>
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {GRADUATION_CONFIG.graduate.faculty} • {GRADUATION_CONFIG.graduate.university}
                </p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 py-2 max-w-md mx-auto lg:mx-0">
              <LuxuryTiltCard className="bg-white/95 p-3.5 rounded-2xl text-center border border-[#C5A059]/25 shadow-sm">
                <div className="text-[#8A6D3B] font-numeral font-bold text-base sm:text-lg">
                  {GRADUATION_CONFIG.graduate.classCode}
                </div>
                <div className="text-[10px] text-slate-500 font-medium tracking-wide">LỚP SINH VIÊN</div>
              </LuxuryTiltCard>
              <LuxuryTiltCard className="bg-white/95 p-3.5 rounded-2xl text-center border border-[#C5A059]/25 shadow-sm">
                <div className="text-[#8A6D3B] font-numeral font-bold text-base sm:text-lg">
                  K27
                </div>
                <div className="text-[10px] text-slate-500 font-medium tracking-wide">SINH VIÊN KHÓA</div>
              </LuxuryTiltCard>
              <LuxuryTiltCard className="bg-white/95 p-3.5 rounded-2xl text-center border border-[#C5A059]/25 shadow-sm">
                <div className="text-emerald-700 font-sans font-bold text-sm sm:text-base flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> TÂN KỸ SƯ
                </div>
                <div className="text-[10px] text-slate-500 font-medium tracking-wide">DANH HIỆU</div>
              </LuxuryTiltCard>
            </div>

            {/* Event Highlights Quick Bar */}
            <LuxuryTiltCard className="space-y-2.5 text-xs sm:text-sm text-slate-700 bg-white/95 p-4 rounded-2xl border border-[#C5A059]/25 shadow-sm">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span><strong className="text-slate-900">Thời gian:</strong> <span className="font-numeral font-semibold">{GRADUATION_CONFIG.event.time}</span> — {GRADUATION_CONFIG.event.date}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span><strong className="text-slate-900">Địa điểm:</strong> {GRADUATION_CONFIG.event.locationName}</span>
              </div>
            </LuxuryTiltCard>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                href="#rsvp"
                onClick={() => sound.playClick()}
                className="px-6 py-3.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-[#F3E5AB] font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-md shadow-slate-900/10 border border-[#C5A059]/35 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-[#D4AF37]" />
                <span>XÁC NHẬN THAM DỰ (RSVP)</span>
              </a>

              <a
                href="#timeline"
                onClick={() => sound.playClick()}
                className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-[#C5A059]/40 text-slate-800 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm"
              >
                <Award className="w-4 h-4 text-[#C5A059]" />
                <span>Xem Lịch Trình</span>
              </a>
            </div>
          </div>

          {/* Right Column: 3D Interactive Graduation Mortarboard & Scroll */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            <div className="relative w-full max-w-lg lg:max-w-none bg-white/90 rounded-3xl p-3 sm:p-5 border border-[#C5A059]/30 shadow-xl shadow-slate-900/5">
              {/* Corner luxury accents */}
              <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-[#C5A059]/60 pointer-events-none" />
              <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-[#C5A059]/60 pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-[#C5A059]/60 pointer-events-none" />
              <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-[#C5A059]/60 pointer-events-none" />

              {/* 3D Scene */}
              <ThreeGraduationScene />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
