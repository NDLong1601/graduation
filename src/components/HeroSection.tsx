import React from 'react';
import { GRADUATION_CONFIG } from '../config';
import { ThreeGraduationScene } from './ThreeGraduationScene';
import { sound } from '../utils/audioFx';
import { Award, Calendar, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-6 pb-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-600/20 via-pink-600/20 to-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Hero Text & Call To Actions */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            {/* Top Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/70 border border-rose-500/30 text-xs font-mono-code text-rose-300 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>ACADEMIC_QUEST // 100% COMPLETED</span>
            </div>

            {/* Main Headings */}
            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-mono-code text-rose-400 tracking-widest uppercase">
                THƯ MỜI THAM DỰ LỄ TỐT NGHIỆP
              </p>
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-tech font-extrabold tracking-tight text-white leading-tight sm:leading-none">
                <span className="block text-rose-100">CHÀO MỪNG ĐẾN</span>
                <span className="neon-gradient-text block mt-1">THE GRADUATION</span>
              </h1>
              <div className="pt-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                  {GRADUATION_CONFIG.graduate.fullName}
                </h2>
                <p className="text-sm sm:text-base text-rose-100 font-medium">
                  {GRADUATION_CONFIG.graduate.degree} • {GRADUATION_CONFIG.graduate.major}
                </p>
                <p className="text-xs sm:text-sm text-rose-300/80">
                  {GRADUATION_CONFIG.graduate.university}
                  {GRADUATION_CONFIG.graduate.faculty ? ` (${GRADUATION_CONFIG.graduate.faculty})` : ''}
                </p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 py-2 max-w-md mx-auto lg:mx-0">
              <div className="cyber-card p-3 rounded-2xl text-center border-rose-900/60">
                <div className="text-amber-300 font-tech font-bold text-base sm:text-lg">
                  {GRADUATION_CONFIG.graduate.classCode || '2022-2026'}
                </div>
                <div className="text-[10px] text-rose-300/70 font-mono-code">NIÊN KHÓA</div>
              </div>
              <div className="cyber-card p-3 rounded-2xl text-center border-rose-900/60">
                <div className="text-rose-400 font-tech font-bold text-base sm:text-lg">A+</div>
                <div className="text-[10px] text-rose-300/70 font-mono-code">KHÓA LUẬN</div>
              </div>
              <div className="cyber-card p-3 rounded-2xl text-center border-rose-900/60">
                <div className="text-emerald-400 font-tech font-bold text-base sm:text-lg flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                </div>
                <div className="text-[10px] text-rose-300/70 font-mono-code">TRẠNG THÁI</div>
              </div>
            </div>

            {/* Event Highlights Quick Bar */}
            <div className="space-y-2 text-xs sm:text-sm text-rose-100 bg-rose-950/40 p-4 rounded-2xl border border-rose-900/60 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong className="text-white">Thời gian:</strong> {GRADUATION_CONFIG.event.time} — {GRADUATION_CONFIG.event.date}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span><strong className="text-white">Địa điểm:</strong> {GRADUATION_CONFIG.event.locationName}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <a
                href="#rsvp"
                onClick={() => sound.playClick()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-tech font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-rose-950/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>XÁC NHẬN THAM DỰ (RSVP)</span>
              </a>

              <a
                href="#timeline"
                onClick={() => sound.playClick()}
                className="px-5 py-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 text-rose-100 font-medium text-xs sm:text-sm transition-all flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Xem Lịch Trình</span>
              </a>
            </div>
          </div>

          {/* Right Column: 3D Interactive Graduation Mortarboard & Scroll */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            <div className="relative w-full max-w-lg lg:max-w-none cyber-card rounded-3xl p-3 sm:p-5 border-rose-500/25 shadow-2xl">
              {/* Corner tech accents */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-rose-400 pointer-events-none" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-rose-400 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-rose-400 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-rose-400 pointer-events-none" />

              {/* 3D Scene */}
              <ThreeGraduationScene />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
