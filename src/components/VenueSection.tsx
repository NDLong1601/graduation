import React from 'react';
import { GRADUATION_CONFIG } from '../config';
import { sound } from '../utils/audioFx';
import { MapPin, Navigation, Car, Compass, Info } from 'lucide-react';

export const VenueSection: React.FC = () => {
  return (
    <section id="venue" className="py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono-code text-rose-300 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>GEO_COORDINATES // ĐỊA ĐIỂM TỔ CHỨC</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-tech font-bold text-white tracking-wide">
            ĐỊA ĐIỂM & CHỈ ĐƯỜNG
          </h2>
          <p className="text-sm text-rose-200/80 max-w-lg mx-auto">
            Vị trí hội trường diễn ra buổi lễ tốt nghiệp và hướng dẫn đường đi, gửi xe thuận tiện nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Info Panel */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="cyber-card p-6 rounded-3xl border-rose-500/25 space-y-5">
              <div>
                <div className="text-xs font-mono-code text-rose-400 uppercase tracking-wider mb-1">
                  ĐỊA ĐIỂM CHÍNH
                </div>
                <h3 className="text-xl sm:text-2xl font-tech font-bold text-white">
                  {GRADUATION_CONFIG.event.locationName}
                </h3>
                <p className="text-sm text-amber-300 mt-1">
                  {GRADUATION_CONFIG.event.hall}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-rose-900/60 text-xs sm:text-sm text-rose-100">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Địa chỉ:</span>
                    <p className="text-rose-200 mt-0.5">{GRADUATION_CONFIG.event.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Car className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Bãi gửi xe:</span>
                    <p className="text-rose-200 mt-0.5">
                      Gửi xe tại Bãi giữ xe Cổng 1 (đối diện sảnh chính) hoặc Bãi xe nhà xe trung tâm.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Lưu ý ngày lễ:</span>
                    <p className="text-rose-200 mt-0.5">
                      Ngày tốt nghiệp trường thường khá đông xe, quý khách nên đến trước 30 phút để chọn được góc chụp hình đẹp nhất!
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Maps Navigation Button */}
              <div className="pt-2">
                <a
                  href={GRADUATION_CONFIG.event.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-tech font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-rose-950/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  <span>MỞ CHỈ ĐƯỜNG GOOGLE MAPS</span>
                </a>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="cyber-card p-4 rounded-2xl border-rose-900/60 flex items-center justify-between text-xs">
              <div>
                <span className="text-rose-300/80">Cần hỗ trợ hướng dẫn đường?</span>
                <p className="font-bold text-white">Hotline / Zalo: {GRADUATION_CONFIG.contact.phone}</p>
              </div>
              <a
                href={`tel:${GRADUATION_CONFIG.contact.phone.replace(/\s+/g, '')}`}
                onClick={() => sound.playClick()}
                className="px-3 py-1.5 rounded-xl bg-rose-950 border border-rose-500/40 text-rose-300 font-semibold hover:bg-rose-900"
              >
                Gọi ngay
              </a>
            </div>
          </div>

          {/* Right Map Embed */}
          <div className="lg:col-span-7 cyber-card rounded-3xl overflow-hidden border-rose-500/25 h-[380px] lg:h-auto min-h-[380px] relative">
            <iframe
              src={GRADUATION_CONFIG.event.googleMapsEmbedUrl}
              className="w-full h-full border-0 absolute inset-0 filter invert-[0.9] hue-rotate-[300deg] contrast-[1.1] opacity-90"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Graduation Venue Google Map"
            />
            {/* Map corner badge */}
            <div className="absolute top-3 left-3 bg-[#120409]/90 backdrop-blur-md px-3 py-1 rounded-xl border border-rose-500/30 text-[11px] font-mono-code text-rose-300 pointer-events-none">
              GPS: 10.7726° N, 106.6577° E
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
