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
        <div className="luxury-card rounded-3xl p-6 sm:p-10 relative">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-sans font-medium text-amber-800 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 shadow-sm">
              <UserCheck className="w-3.5 h-3.5 text-amber-600" />
              <span className="tracking-wide">PHẢN HỒI THAM DỰ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-slate-900 tracking-tight">
              Xác Nhận Tham Dự
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Vui lòng gửi xác nhận trước ngày <strong className="text-amber-700 font-semibold font-numeral">12/10/2026</strong> để mình chuẩn bị tiếp đón chu đáo nhất nhé!
            </p>
          </div>

          {/* Form or Success State */}
          {isSubmitted ? (
            <div className="bg-amber-50/60 rounded-2xl p-6 sm:p-8 border border-amber-200/80 text-center space-y-4 animate-fadeIn shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-white border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-slate-900">
                  Xác Nhận Thành Công!
                </h3>
                <p className="text-sm text-amber-800 mt-1 font-medium">
                  Cảm ơn <span className="font-bold underline text-slate-900">{formData.fullName}</span> rất nhiều!
                </p>
                <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                  {formData.attending === 'yes'
                    ? `Mình rất háo hức được gặp bạn cùng ${formData.guestsCount} người vào ngày 16/10 tại ${GRADUATION_CONFIG.event.locationName}!`
                    : 'Dù bạn không thể đến trực tiếp, mình vẫn rất trân trọng tình cảm và lời chúc của bạn!'}
                </p>
              </div>

              {/* Digital Pass Ticket */}
              <div className="p-5 rounded-2xl bg-white border border-amber-200/90 text-left font-sans text-xs space-y-2 max-w-sm mx-auto shadow-sm">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px]">THẺ THAM DỰ</span>
                  <span className="text-amber-700 font-bold font-numeral text-sm">#TK-{Math.floor(1000 + Math.random() * 9000)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Khách mời:</span>
                  <span className="text-slate-900 font-semibold">{formData.fullName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Số lượng:</span>
                  <span className="text-slate-900 font-medium">{formData.guestsCount} người</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tiệc thân mật:</span>
                  <span className="text-amber-800 font-semibold">{formData.afterParty ? 'Có tham gia' : 'Không tham gia'}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsSubmitted(false);
                }}
                className="text-xs text-slate-500 hover:text-amber-800 underline font-sans transition-colors pt-2 inline-block"
              >
                Gửi lại phản hồi khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-sans font-semibold text-slate-700 tracking-wide">
                    HỌ VÀ TÊN <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="VD: Nguyễn Văn B"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-sans font-semibold text-slate-700 tracking-wide">
                    SỐ ĐIỆN THOẠI / ZALO
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="09xx xxx xxx"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Relation & Attendance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-sans font-semibold text-slate-700 tracking-wide">
                    MỐI QUAN HỆ
                  </label>
                  <select
                    value={formData.relation}
                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 text-sm text-slate-800 outline-none transition-all shadow-sm"
                  >
                    <option value="Gia đình">Gia đình & Người thân</option>
                    <option value="Bạn cùng lớp">Bạn cùng lớp / Khóa</option>
                    <option value="Bạn thân">Bạn thân (BFF)</option>
                    <option value="Đồng nghiệp">Đồng nghiệp / Công ty</option>
                    <option value="Thầy cô">Thầy cô / Giảng viên</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-sans font-semibold text-slate-700 tracking-wide">
                    BẠN SẼ THAM DỰ CHỨ?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, attending: 'yes' })}
                      className={`py-3 px-3 rounded-xl text-xs font-bold font-sans tracking-wide uppercase border transition-all ${
                        formData.attending === 'yes'
                          ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      CHẮC CHẮN ĐẾN! 🎉
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, attending: 'no' })}
                      className={`py-3 px-3 rounded-xl text-xs font-bold font-sans tracking-wide uppercase border transition-all ${
                        formData.attending === 'no'
                          ? 'bg-stone-100 border-stone-300 text-stone-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      TIẾC QUÁ BẬN MẤT 😢
                    </button>
                  </div>
                </div>
              </div>

              {/* Number of guests & After party (only if attending) */}
              {formData.attending === 'yes' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/70">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-sans font-semibold text-slate-700">
                      SỐ LƯỢNG NGƯỜI ĐI CÙNG
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={formData.guestsCount}
                      onChange={(e) => setFormData({ ...formData, guestsCount: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-300"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-3 sm:pt-6">
                    <input
                      type="checkbox"
                      id="afterParty"
                      checked={formData.afterParty}
                      onChange={(e) => setFormData({ ...formData, afterParty: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-400 border-slate-300"
                    />
                    <label htmlFor="afterParty" className="text-xs text-slate-700 cursor-pointer font-medium">
                      Sẽ ở lại chụp ảnh & dự tiệc nhẹ cùng mình ✨
                    </label>
                  </div>
                </div>
              )}

              {/* Message */}
              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                  <span>LỜI NHẮN NHỦ GỬI ĐẾN TÂN KHOA</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Gửi một lời chúc hoặc lời nhắn nhủ thân thương..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all resize-none shadow-sm"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:to-slate-700 text-amber-300 font-sans font-semibold text-sm tracking-wide uppercase shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 border border-amber-500/30"
              >
                {isSubmitting ? (
                  <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                ) : (
                  <Send className="w-4 h-4 text-amber-400" />
                )}
                <span>{isSubmitting ? 'ĐANG GỬI XÁC NHẬN...' : 'GỬI XÁC NHẬN THAM DỰ'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
