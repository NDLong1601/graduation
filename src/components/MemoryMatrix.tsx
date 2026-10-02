import React from 'react';
import { GRADUATION_CONFIG } from '../config';
import { Terminal, Milestone, Flag } from 'lucide-react';

export const MemoryMatrix: React.FC = () => {
  return (
    <section id="memories" className="py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30">
            <Milestone className="w-3.5 h-3.5" />
            <span>JOURNEY_LOG // HÀNH TRÌNH 4 NĂM ĐẠI HỌC</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-tech font-bold text-white tracking-wide">
            KỶ NIỆM & CỘT MỐC
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Hành trình từ những dòng lệnh chập chững đầu tiên đến khi chạm tay vào tấm bằng danh dự.
          </p>
        </div>

        {/* 4 Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GRADUATION_CONFIG.memories.map((mem, idx) => (
            <div
              key={idx}
              className="cyber-card p-6 rounded-3xl border-slate-800 hover:border-cyan-500/40 transition-all duration-300 group hover:-translate-y-1 relative flex flex-col justify-between"
            >
              {/* Top Meta */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-tech text-xs text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
                    {mem.phase}
                  </span>
                  <span className="font-mono-code text-xs text-slate-400">
                    {mem.year}
                  </span>
                </div>

                {/* Decorative Visual Card */}
                <div
                  className={`w-full h-36 rounded-2xl bg-gradient-to-tr ${mem.imagePlaceholderBg} border border-white/5 flex flex-col items-center justify-center p-4 mb-5 text-center relative overflow-hidden`}
                >
                  <Terminal className="w-8 h-8 text-cyan-300/80 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-tech text-xs text-white/90 uppercase tracking-widest font-semibold">
                    {mem.title}
                  </p>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {mem.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {mem.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                {mem.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] font-mono-code px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-700/60 text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Milestone quote */}
        <div className="mt-12 text-center p-6 cyber-card rounded-2xl border-slate-800">
          <Flag className="w-6 h-6 text-yellow-400 mx-auto mb-2 animate-bounce" />
          <p className="text-sm sm:text-base font-medium text-slate-200 italic max-w-xl mx-auto">
            "Không có chặng đường nào trải đầy hoa hồng, nhưng sau tất cả, những nỗ lực đã được đền đáp xứng đáng bằng nụ cười trong ngày tốt nghiệp!"
          </p>
        </div>
      </div>
    </section>
  );
};
