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
        setWishes(JSON.parse(saved));
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
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#00f5d4', '#f43f5e', '#ffd166'],
    });
  };

  return (
    <section id="guestbook" className="py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code text-pink-400 px-3 py-1 rounded-full bg-pink-950/40 border border-pink-500/30">
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span>WISH_MATRIX // BỨC TƯỜNG LỜI CHÚC</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-tech font-bold text-white tracking-wide">
            SỔ LƯU BÚT TƯƠNG TÁC
          </h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Gửi lại vài dòng nhắn nhủ thân thương để lưu lại khoảnh khắc đáng nhớ cùng tân khoa nhé!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Post Wish Box */}
          <div className="lg:col-span-5">
            <div className="cyber-card p-6 rounded-3xl border-cyan-500/20 sticky top-20">
              <h3 className="font-tech text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span>GỬI LỜI CHÚC MỪNG</span>
              </h3>

              <form onSubmit={handleAddWish} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono-code text-slate-400 mb-1">
                    BẠN TÊN LÀ GÌ?
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Minh Thư..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-400 mb-1">
                    MỐI QUAN HỆ
                  </label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 outline-none"
                  >
                    <option value="Bạn bè">Bạn bè</option>
                    <option value="Bạn thân">Bạn thân</option>
                    <option value="Gia đình">Gia đình</option>
                    <option value="Đồng nghiệp">Đồng nghiệp</option>
                    <option value="Thầy cô">Thầy cô</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-400 mb-1">
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
                            ? 'bg-cyan-500/20 border-2 border-cyan-400 scale-110'
                            : 'bg-slate-900 border border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-slate-400 mb-1">
                    NỘI DUNG LỜI CHÚC
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Chúc mừng tốt nghiệp! Chúc bạn sự nghiệp thăng hoa..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:border-cyan-400 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-tech font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                  <span>ĐĂNG LÊN TƯỜNG (POST)</span>
                </button>
              </form>
            </div>
          </div>

          {/* Wall Display */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-code text-slate-400 pb-2 border-b border-slate-800">
              <span>TỔNG CỘNG: {wishes.length} LỜI CHÚC</span>
              <span className="flex items-center gap-1 text-pink-400">
                <Heart className="w-3.5 h-3.5 fill-pink-400" /> LOVE & PRAISE
              </span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {wishes.map((item) => (
                <div
                  key={item.id}
                  className="cyber-card p-5 rounded-2xl border-slate-800 hover:border-cyan-500/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shadow-inner">
                        {item.avatarEmoji}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {item.name}
                        </h4>
                        <span className="text-[11px] font-mono-code text-purple-400">
                          {item.relation}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono-code text-slate-500">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 pl-13 leading-relaxed">
                    "{item.message}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
