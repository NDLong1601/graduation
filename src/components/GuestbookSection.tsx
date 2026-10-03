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
      colors: ['#fb7185', '#f43f5e', '#fbbf24'],
    });
  };

  return (
    <section id="guestbook" className="py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code text-rose-300 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30">
            <MessageSquareHeart className="w-3.5 h-3.5 text-amber-400" />
            <span>WISH_MATRIX // BỨC TƯỜNG LỜI CHÚC</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-tech font-bold text-white tracking-wide">
            SỔ LƯU BÚT TƯƠNG TÁC
          </h2>
          <p className="text-sm text-rose-200/80 max-w-lg mx-auto">
            Gửi lại vài dòng nhắn nhủ thân thương để lưu lại khoảnh khắc đáng nhớ cùng tân khoa nhé!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Post Wish Box */}
          <div className="lg:col-span-5">
            <div className="cyber-card p-6 rounded-3xl border-rose-500/25 sticky top-20">
              <h3 className="font-tech text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>GỬI LỜI CHÚC MỪNG</span>
              </h3>

              <form onSubmit={handleAddWish} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono-code text-rose-300/80 mb-1">
                    BẠN TÊN LÀ GÌ?
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Minh Thư..."
                    className="w-full px-4 py-2.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-sm text-white focus:border-rose-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-rose-300/80 mb-1">
                    MỐI QUAN HỆ
                  </label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-rose-950/60 border border-rose-900/60 text-sm text-white focus:border-rose-400 outline-none"
                  >
                    <option value="Bạn bè" className="bg-[#120409]">Bạn bè</option>
                    <option value="Bạn thân" className="bg-[#120409]">Bạn thân</option>
                    <option value="Gia đình" className="bg-[#120409]">Gia đình</option>
                    <option value="Đồng nghiệp" className="bg-[#120409]">Đồng nghiệp</option>
                    <option value="Thầy cô" className="bg-[#120409]">Thầy cô</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-rose-300/80 mb-1">
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
                            ? 'bg-rose-600/30 border-2 border-rose-400 scale-110 shadow-md shadow-rose-950/50'
                            : 'bg-rose-950/40 border border-rose-900/50 hover:bg-rose-900/50'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-rose-300/80 mb-1">
                    NỘI DUNG LỜI CHÚC
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Chúc mừng tốt nghiệp! Chúc bạn sự nghiệp thăng hoa..."
                    className="w-full px-4 py-2.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-sm text-white focus:border-rose-400 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                  <span>ĐĂNG LÊN TƯỜNG (POST)</span>
                </button>
              </form>
            </div>
          </div>

          {/* Wall Display */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-code text-rose-300/70 pb-2 border-b border-rose-900/60">
              <span>TỔNG CỘNG: {wishes.length} LỜI CHÚC</span>
              <span className="flex items-center gap-1 text-rose-400">
                <Heart className="w-3.5 h-3.5 fill-rose-400" /> LOVE & PRAISE
              </span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {wishes.length === 0 ? (
                <div className="cyber-card p-10 rounded-2xl border-rose-900/60 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-rose-950 border border-rose-800/60 flex items-center justify-center text-2xl mx-auto shadow-inner">
                    💌
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Chưa có lời chúc nào</h4>
                    <p className="text-xs text-rose-200/70 mt-1">
                      Hãy là người đầu tiên gửi những lời chúc tốt đẹp nhất đến tân khoa nhé!
                    </p>
                  </div>
                </div>
              ) : (
                wishes.map((item) => (
                  <div
                    key={item.id}
                    className="cyber-card p-5 rounded-2xl border-rose-900/60 hover:border-rose-500/40 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-800/60 flex items-center justify-center text-xl shadow-inner">
                          {item.avatarEmoji}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                            {item.name}
                          </h4>
                          <span className="text-[11px] font-mono-code text-rose-300">
                            {item.relation}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono-code text-rose-300/60">
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-rose-100/90 pl-13 leading-relaxed">
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
