import React from 'react';
import { GRADUATION_CONFIG } from '../config';
import { Camera, Mic, Award, Sparkles, Coffee } from 'lucide-react';

export const EventTimeline: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'camera':
        return <Camera className="w-4 h-4 text-[#8A6D3B]" />;
      case 'mic':
        return <Mic className="w-4 h-4 text-[#8A6D3B]" />;
      case 'award':
        return <Award className="w-4 h-4 text-[#C5A059]" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4 text-[#C5A059]" />;
      case 'coffee':
        return <Coffee className="w-4 h-4 text-[#8A6D3B]" />;
      default:
        return <Award className="w-4 h-4 text-[#C5A059]" />;
    }
  };

  return (
    <section id="timeline" className="py-16 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#8A6D3B] px-3.5 py-1 rounded-full bg-[#F7F4EC] border border-[#C5A059]/35">
            <span className="tracking-wider uppercase">LỊCH TRÌNH CHI TIẾT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#0F172A] tracking-tight">
            Chương Trình Buổi Lễ
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Các mốc thời gian hoạt động chính trong ngày tốt nghiệp để quý người thân và bạn bè tiện sắp xếp.
          </p>
        </div>

        {/* Timeline Path */}
        <div className="relative border-l-2 border-[#C5A059]/40 ml-4 sm:ml-32 space-y-7">
          {GRADUATION_CONFIG.timeline.map((item, index) => (
            <div key={index} className="relative pl-6 sm:pl-8 group">
              {/* Timeline Marker */}
              <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-white border-2 border-[#C5A059] flex items-center justify-center shadow-md shadow-slate-900/5 group-hover:scale-110 transition-all">
                {getIcon(item.icon)}
              </div>

              {/* Time Tag on the left for tablet/desktop */}
              <div className="hidden sm:block absolute -left-32 top-2 w-24 text-right">
                <span className="font-sans text-xs text-[#8A6D3B] font-bold bg-[#F7F4EC] px-2.5 py-1 rounded-lg border border-[#C5A059]/30 shadow-sm tracking-wide tabular-nums">
                  {item.time.split('-')[0].trim()}
                </span>
              </div>

              {/* Timeline Card */}
              <div className="bg-white/95 p-5 sm:p-6 rounded-2xl border border-[#C5A059]/25 hover:border-[#C5A059]/60 shadow-sm hover:shadow-md transition-all duration-300 group-hover:translate-x-1">
                {/* Mobile time display */}
                <div className="sm:hidden inline-block font-sans text-xs text-[#8A6D3B] font-bold bg-[#F7F4EC] px-2.5 py-0.5 rounded border border-[#C5A059]/30 mb-2 tracking-wide tabular-nums">
                  {item.time}
                </div>

                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F172A] group-hover:text-[#8A6D3B] transition-colors">
                    {item.title}
                  </h3>
                  <span className="hidden sm:inline text-xs font-sans text-slate-500 font-medium tabular-nums">
                    {item.time}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
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
