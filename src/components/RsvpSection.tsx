import React, { useState } from 'react';
import { sound } from '../utils/audioFx';
import { GRADUATION_CONFIG } from '../config';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, UserCheck, Sparkles, MessageSquare } from 'lucide-react';

interface RsvpFormData {
  fullName: string;
  phone: string;
  relation: string;
  attending: 'yes' | 'no';
  guestsCount: number;
  afterParty: boolean;
  message: string;
}

export const RsvpSection: React.FC = () => {
  const [formData, setFormData] = useState<RsvpFormData>({
    fullName: '',
    phone: '',
    relation: 'Bạn bè',
    attending: 'yes',
    guestsCount: 1,
    afterParty: true,
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    setIsSubmitting(true);
    sound.playClick();

    setTimeout(() => {
      // Save locally to localStorage so host can inspect or export
      try {
        const stored = JSON.parse(localStorage.getItem('rsvp_submissions') || '[]');
        stored.push({ ...formData, timestamp: new Date().toISOString() });
        localStorage.setItem('rsvp_submissions', JSON.stringify(stored));
      } catch (err) {
        console.error(err);
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      sound.playSuccess();

      // Confetti burst with Rose Gold and Champagne Gold
      confetti({
        particleCount: 110,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#fb7185', '#fcd34d', '#f43f5e', '#fda4af'],
      });
    }, 600);
  };

  return (
    <section id="rsvp" className="py-16 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cyber-card rounded-3xl p-6 sm:p-10 border-rose-500/25 relative">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-mono-code text-rose-300 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>RSVP_PROTOCOL // XÁC NHẬN THAM DỰ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-tech font-bold text-white tracking-wide">
              XÁC NHẬN THAM DỰ
            </h2>
            <p className="text-xs sm:text-sm text-rose-200/80">
              Vui lòng gửi xác nhận trước ngày <strong className="text-amber-300">12/10/2026</strong> để mình chuẩn bị tiếp đón chu đáo nhất nhé!
            </p>
          </div>

          {/* Form or Success State */}
          {isSubmitted ? (
            <div className="bg-rose-950/60 rounded-2xl p-6 sm:p-8 border border-rose-500/40 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-rose-900/60 border border-rose-400 flex items-center justify-center mx-auto text-amber-300 shadow-lg shadow-rose-950/50">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-tech text-xl sm:text-2xl font-bold text-white">
                  XÁC NHẬN THÀNH CÔNG!
                </h3>
                <p className="text-sm text-rose-300 mt-1 font-medium">
                  Cảm ơn <span className="font-bold underline text-white">{formData.fullName}</span> rất nhiều!
                </p>
                <p className="text-xs text-rose-200/80 mt-2 max-w-md mx-auto">
                  {formData.attending === 'yes'
                    ? `Mình rất háo hức được gặp bạn cùng ${formData.guestsCount} người vào ngày 16/10 tại ${GRADUATION_CONFIG.event.locationName}!`
                    : 'Dù bạn không thể đến trực tiếp, mình vẫn rất trân trọng tình cảm và lời chúc của bạn!'}
                </p>
              </div>

              {/* Digital Pass Ticket */}
              <div className="p-4 rounded-xl bg-[#120409]/90 border border-rose-800/60 text-left font-mono-code text-xs space-y-1.5 max-w-sm mx-auto shadow-md">
                <div className="flex justify-between text-rose-300/70">
                  <span>MÃ XÁC NHẬN:</span>
                  <span className="text-amber-400 font-bold">#TK-{Math.floor(1000 + Math.random() * 9000)}</span>
                </div>
                <div className="flex justify-between text-rose-300/70">
                  <span>KHÁCH MỜI:</span>
                  <span className="text-white font-semibold">{formData.fullName}</span>
                </div>
                <div className="flex justify-between text-rose-300/70">
                  <span>SỐ LƯỢNG:</span>
                  <span className="text-rose-300">{formData.guestsCount} người</span>
                </div>
                <div className="flex justify-between text-rose-300/70">
                  <span>TIỆC THÂN MẬT:</span>
                  <span className="text-amber-300 font-semibold">{formData.afterParty ? 'CÓ THAM GIA' : 'KHÔNG THAM GIA'}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsSubmitted(false);
                }}
                className="text-xs text-rose-300/80 hover:text-amber-300 underline font-mono-code transition-colors"
              >
                Gửi lại phản hồi khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono-code text-rose-200">
                    HỌ VÀ TÊN <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="VD: Nguyễn Văn B"
                    className="w-full px-4 py-3 rounded-xl bg-rose-950/40 border border-rose-900/60 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 text-sm text-white placeholder-rose-400/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono-code text-rose-200">
                    SỐ ĐIỆN THOẠI / ZALO
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="09xx xxx xxx"
                    className="w-full px-4 py-3 rounded-xl bg-rose-950/40 border border-rose-900/60 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 text-sm text-white placeholder-rose-400/50 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Relation & Attendance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono-code text-rose-200">
                    MỐI QUAN HỆ
                  </label>
                  <select
                    value={formData.relation}
                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-rose-950/60 border border-rose-900/60 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 text-sm text-white outline-none transition-all"
                  >
                    <option value="Gia đình" className="bg-[#120409]">Gia đình & Người thân</option>
                    <option value="Bạn cùng lớp" className="bg-[#120409]">Bạn cùng lớp / Khóa</option>
                    <option value="Bạn thân" className="bg-[#120409]">Bạn thân (BFF)</option>
                    <option value="Đồng nghiệp" className="bg-[#120409]">Đồng nghiệp / Công ty</option>
                    <option value="Thầy cô" className="bg-[#120409]">Thầy cô / Giảng viên</option>
                    <option value="Khác" className="bg-[#120409]">Khác</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono-code text-rose-200">
                    BẠN SẼ THAM DỰ CHỨ?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, attending: 'yes' })}
                      className={`py-3 px-3 rounded-xl text-xs font-bold font-tech uppercase border transition-all ${
                        formData.attending === 'yes'
                          ? 'bg-rose-600/30 border-rose-400 text-white shadow-md shadow-rose-950/50'
                          : 'bg-rose-950/30 border-rose-900/40 text-rose-300/70 hover:text-white'
                      }`}
                    >
                      CHẮC CHẮN ĐẾN! 🎉
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, attending: 'no' })}
                      className={`py-3 px-3 rounded-xl text-xs font-bold font-tech uppercase border transition-all ${
                        formData.attending === 'no'
                          ? 'bg-amber-600/30 border-amber-400 text-amber-200'
                          : 'bg-rose-950/30 border-rose-900/40 text-rose-300/70 hover:text-white'
                      }`}
                    >
                      TIẾC QUÁ BẬN MẤT 😢
                    </button>
                  </div>
                </div>
              </div>

              {/* Number of guests & After party (only if attending) */}
              {formData.attending === 'yes' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-rose-950/30 border border-rose-900/50">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono-code text-rose-200">
                      SỐ LƯỢNG NGƯỜI ĐI CÙNG
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={formData.guestsCount}
                      onChange={(e) => setFormData({ ...formData, guestsCount: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#120409] border border-rose-900/60 text-sm text-white outline-none focus:border-rose-400"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4 sm:pt-6">
                    <input
                      type="checkbox"
                      id="afterParty"
                      checked={formData.afterParty}
                      onChange={(e) => setFormData({ ...formData, afterParty: e.target.checked })}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-400 bg-rose-950 border-rose-800"
                    />
                    <label htmlFor="afterParty" className="text-xs text-rose-200 cursor-pointer">
                      Sẽ ở lại dự tiệc nhẹ/ăn trưa cùng mình ✨
                    </label>
                  </div>
                </div>
              )}

              {/* Message */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono-code text-rose-200 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                  <span>LỜI CHÚC GỬI ĐẾN TÂN KHOA</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Gửi một lời chúc hoặc lời nhắn nhủ thân thương..."
                  className="w-full px-4 py-3 rounded-xl bg-rose-950/40 border border-rose-900/60 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 text-sm text-white placeholder-rose-400/50 outline-none transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-tech font-bold text-sm tracking-wider uppercase shadow-lg shadow-rose-950/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'ĐANG GỬI XÁC NHẬN...' : 'XÁC NHẬN THAM DỰ (SUBMIT)'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
