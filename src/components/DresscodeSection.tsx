import React, { useState } from 'react';
import { GRADUATION_CONFIG } from '../config';
import { sound } from '../utils/audioFx';
import { Palette, Check, Copy, Shirt, Sparkles } from 'lucide-react';

export const DresscodeSection: React.FC = () => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const copyToClipboard = (hex: string) => {
    sound.playClick();
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <section id="dresscode" className="py-16 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30">
            <Palette className="w-3.5 h-3.5" />
            <span>VISUAL_AESTHETICS // MÀU SẮC TRANG PHỤC</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-tech font-bold text-white tracking-wide">
            {GRADUATION_CONFIG.dresscode.title}
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            {GRADUATION_CONFIG.dresscode.description}
          </p>
        </div>

        {/* Color Palette Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {GRADUATION_CONFIG.dresscode.colors.map((color, idx) => (
            <div
              key={idx}
              onClick={() => copyToClipboard(color.hex)}
              className="cyber-card p-4 rounded-2xl border-slate-800 hover:border-cyan-500/40 cursor-pointer group transition-all duration-300 hover:-translate-y-1 text-center"
            >
              {/* Color Swatch Circle */}
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-3 shadow-lg border-2 border-white/10 group-hover:scale-105 transition-transform flex items-center justify-center"
                style={{ backgroundColor: color.hex }}
              >
                {copiedHex === color.hex ? (
                  <Check className="w-6 h-6 text-emerald-400 bg-slate-900/80 p-1 rounded-full" />
                ) : (
                  <Copy className="w-4 h-4 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>

              <h4 className="font-tech text-xs sm:text-sm font-bold text-white mb-1">
                {color.name}
              </h4>
              <p className="text-[11px] text-slate-400 mb-2">
                {color.desc}
              </p>
              <div className="inline-block text-[10px] font-mono-code text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                {copiedHex === color.hex ? 'ĐÃ COPY!' : color.hex}
              </div>
            </div>
          ))}
        </div>

        {/* Dress code & photo tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="cyber-card p-6 rounded-2xl border-slate-800 flex gap-4 items-start">
            <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 shrink-0">
              <Shirt className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm sm:text-base">Gợi Ý Trang Phục</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Áo sơ mi, đầm thanh lịch, áo dài truyền thống hoặc đồ phong cách smart-casual sẽ rất ăn ảnh khi chụp cùng áo thụng cử nhân!
              </p>
            </div>
          </div>

          <div className="cyber-card p-6 rounded-2xl border-slate-800 flex gap-4 items-start">
            <div className="p-3 rounded-xl bg-purple-950 border border-purple-500/30 text-purple-400 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm sm:text-base">Mẹo Chụp Ảnh "Sống Ảo"</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Đừng quên sạc đầy pin điện thoại hoặc mang theo sạc dự phòng, vì chúng mình sẽ có hàng trăm bức ảnh kỷ niệm tuyệt đẹp cùng nhau!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
