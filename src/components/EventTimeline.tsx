import React from 'react';
import { GRADUATION_CONFIG } from '../config';
import { Camera, Mic, Award, Sparkles, Coffee } from 'lucide-react';

export const EventTimeline: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'camera':
        return <Camera className="w-5 h-5 text-rose-400" />;
      case 'mic':
        return <Mic className="w-5 h-5 text-amber-400" />;
      case 'award':
        return <Award className="w-5 h-5 text-amber-300" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-pink-400" />;
      case 'coffee':
        return <Coffee className="w-5 h-5 text-rose-300" />;
      default:
        return <Award className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <section id="timeline" className="py-16 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code text-rose-300 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30">
            <span>PROTOCOL_SCHEDULE // LỊCH TRÌNH CHI TIẾT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-tech font-bold text-white tracking-wide">
            DÒNG THỜI GIAN BUỔI LỄ
          </h2>
          <p className="text-sm text-rose-200/80 max-w-lg mx-auto">
            Khung giờ các hoạt động chính trong ngày tốt nghiệp để bạn và gia đình tiện sắp xếp thời gian đến chung vui.
          </p>
        </div>

        {/* Timeline Path */}
        <div className="relative border-l-2 border-rose-500/30 ml-4 sm:ml-32 space-y-8">
          {GRADUATION_CONFIG.timeline.map((item, index) => (
            <div key={index} className="relative pl-6 sm:pl-8 group">
              {/* Glowing Timeline Marker */}
              <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-xl bg-[#120409] border border-rose-400 flex items-center justify-center shadow-lg shadow-rose-950/60 group-hover:scale-110 group-hover:border-amber-400 transition-all">
                {getIcon(item.icon)}
              </div>

              {/* Time Tag on the left for tablet/desktop */}
              <div className="hidden sm:block absolute -left-32 top-2 w-24 text-right">
                <span className="font-tech text-xs text-amber-300 font-bold bg-rose-950/80 px-2 py-1 rounded border border-rose-500/30 shadow-sm">
                  {item.time.split('-')[0].trim()}
                </span>
              </div>

              {/* Timeline Card */}
              <div className="cyber-card p-5 sm:p-6 rounded-2xl border-rose-900/60 hover:border-rose-500/40 transition-all duration-300 group-hover:translate-x-1">
                {/* Mobile time display */}
                <div className="sm:hidden inline-block font-tech text-xs text-amber-300 font-bold bg-rose-950/70 px-2.5 py-0.5 rounded border border-rose-500/30 mb-2">
                  {item.time}
                </div>

                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
                    {item.title}
                  </h3>
                  <span className="hidden sm:inline font-mono-code text-xs text-rose-300/70">
                    {item.time}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
