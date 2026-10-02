import React from 'react';
import { GRADUATION_CONFIG } from '../config';
import { Camera, Mic, Award, Sparkles, Coffee } from 'lucide-react';

export const EventTimeline: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'camera':
        return <Camera className="w-5 h-5 text-cyan-400" />;
      case 'mic':
        return <Mic className="w-5 h-5 text-purple-400" />;
      case 'award':
        return <Award className="w-5 h-5 text-yellow-400" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-pink-400" />;
      case 'coffee':
        return <Coffee className="w-5 h-5 text-emerald-400" />;
      default:
        return <Award className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="timeline" className="py-16 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code text-purple-400 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30">
            <span>PROTOCOL_SCHEDULE // LỊCH TRÌNH CHI TIẾT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-tech font-bold text-white tracking-wide">
            DÒNG THỜI GIAN BUỔI LỄ
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Khung giờ các hoạt động chính trong ngày tốt nghiệp để bạn và gia đình tiện sắp xếp thời gian đến chung vui.
          </p>
        </div>

        {/* Timeline Path */}
        <div className="relative border-l-2 border-cyan-500/30 ml-4 sm:ml-32 space-y-8">
          {GRADUATION_CONFIG.timeline.map((item, index) => (
            <div key={index} className="relative pl-6 sm:pl-8 group">
              {/* Glowing Timeline Marker */}
              <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-xl bg-slate-950 border border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 group-hover:border-purple-400 transition-all">
                {getIcon(item.icon)}
              </div>

              {/* Time Tag on the left for tablet/desktop */}
              <div className="hidden sm:block absolute -left-32 top-2 w-24 text-right">
                <span className="font-tech text-xs text-cyan-300 font-bold bg-slate-900/80 px-2 py-1 rounded border border-cyan-500/20">
                  {item.time.split('-')[0].trim()}
                </span>
              </div>

              {/* Timeline Card */}
              <div className="cyber-card p-5 sm:p-6 rounded-2xl border-slate-800 hover:border-cyan-500/40 transition-all duration-300 group-hover:translate-x-1">
                {/* Mobile time display */}
                <div className="sm:hidden inline-block font-tech text-xs text-cyan-300 font-bold bg-cyan-950/50 px-2.5 py-0.5 rounded border border-cyan-500/30 mb-2">
                  {item.time}
                </div>

                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <span className="hidden sm:inline font-mono-code text-xs text-slate-400">
                    {item.time}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
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
