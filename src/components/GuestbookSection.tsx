import React, { useState, useEffect } from 'react';
import type { WishMessage } from '../types/graduation';
import { INITIAL_WISHES } from '../config';
import { sound } from '../utils/audioFx';
import confetti from 'canvas-confetti';
import { MessageSquareHeart, Send, Heart, Sparkles } from 'lucide-react';

export const GuestbookSection: React.FC = () => {
  const [wishes, setWishes] = useState<WishMessage[]>(INITIAL_WISHES);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Bạn bè');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎓');

  const emojis = ['🎓', '🎉', '🚀', '❤️', '⭐', '✨', '💐', '🥂'];

  // Load stored wishes on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('graduation_guestbook_wishes');
      if (saved) {
        const parsed = JSON.parse(saved);
        const realWishes = parsed.filter((w: WishMessage) => !['wish-1', 'wish-2', 'wish-3'].includes(w.id));
        setWishes(realWishes);
        localStorage.setItem('graduation_guestbook_wishes', JSON.stringify(realWishes));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    sound.playClick();

    const newWish: WishMessage = {
      id: `wish-${Date.now()}`,
      name: name.trim(),
      relation,
      message: message.trim(),
      timestamp: 'Vừa xong',
      avatarEmoji: selectedEmoji,
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem('graduation_guestbook_wishes', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setName('');
    setMessage('');
    sound.playSuccess();

    confetti({
      particleCount: 60,
      spread: 65,
      origin: { y: 0.8 },
      colors: ['#D4AF37', '#C5A059', '#1E293B', '#F59E0B'],
    });
  };

  return (
    <section id="guestbook" className="py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-sans font-medium text-amber-800 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 shadow-sm">
            <MessageSquareHeart className="w-3.5 h-3.5 text-amber-600" />
            <span className="tracking-wide">LƯU BÚT KỶ NIỆM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-slate-900 tracking-tight">
            Sổ Lưu Bút Kỷ Niệm
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Gửi lại vài dòng nhắn nhủ thân thương để lưu lại khoảnh khắc đáng nhớ cùng tân khoa nhé!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Post Wish Box */}
          <div className="lg:col-span-5">
            <div className="luxury-card p-6 sm:p-7 rounded-3xl sticky top-24">
              <h3 className="font-serif-luxury text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span>Gửi Lời Chúc Mừng</span>
              </h3>

              <form onSubmit={handleAddWish} className="space-y-4">
                <div>
                  <label className="block text-xs font-sans font-semibold text-slate-700 mb-1">
                    BẠN TÊN LÀ GÌ?
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Minh Thư..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 outline-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold text-slate-700 mb-1">
                    MỐI QUAN HỆ
                  </label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 outline-none shadow-sm"
                  >
                    <option value="Bạn bè">Bạn bè</option>
                    <option value="Bạn thân">Bạn thân</option>
                    <option value="Gia đình">Gia đình & Người thân</option>
                    <option value="Đồng nghiệp">Đồng nghiệp</option>
                    <option value="Thầy cô">Thầy cô</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold text-slate-700 mb-1">
                    CHỌN ICON AVATAR
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                          selectedEmoji === emoji
                            ? 'bg-amber-100 border-2 border-amber-500 scale-105 shadow-sm'
                            : 'bg-white border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold text-slate-700 mb-1">
                    NỘI DUNG LỜI CHÚC
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Chúc mừng tốt nghiệp! Chúc bạn sự nghiệp thăng hoa và luôn tỏa sáng..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/50 outline-none resize-none shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:to-slate-700 text-amber-300 font-sans font-semibold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] border border-amber-500/30"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>ĐĂNG LỜI CHÚC LÊN TƯỜNG</span>
                </button>
              </form>
            </div>
          </div>

          {/* Wall Display */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs font-sans text-slate-500 pb-2 border-b border-amber-200/60">
              <span className="font-medium">TỔNG CỘNG: {wishes.length} LỜI CHÚC</span>
              <span className="flex items-center gap-1 text-amber-700 font-medium">
                <Heart className="w-3.5 h-3.5 fill-amber-600 text-amber-600" /> TÌNH CẢM & LỜI CHÚC
              </span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {wishes.length === 0 ? (
                <div className="luxury-card p-10 rounded-2xl text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl mx-auto shadow-sm">
                    💌
                  </div>
                  <div>
                    <h4 className="text-base font-serif-luxury font-bold text-slate-800">Chưa có lời chúc nào</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Hãy là người đầu tiên gửi những lời chúc tốt đẹp nhất đến tân khoa nhé!
                    </p>
                  </div>
                </div>
              ) : (
                wishes.map((item) => (
                  <div
                    key={item.id}
                    className="luxury-card p-5 rounded-2xl hover:border-amber-300 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-xl shadow-sm">
                          {item.avatarEmoji}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                            {item.name}
                          </h4>
                          <span className="text-[11px] font-sans text-amber-700 font-medium">
                            {item.relation}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-sans text-slate-400">
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 pl-13 leading-relaxed italic">
                      "{item.message}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
