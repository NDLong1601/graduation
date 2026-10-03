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
          <div className="inline-flex items-center gap-2 text-xs font-sans font-medium text-amber-800 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 shadow-sm">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span className="tracking-wide">ĐỊA ĐIỂM TỔ CHỨC</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-slate-900 tracking-tight">
            Địa Điểm & Chỉ Đường
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Vị trí hội trường diễn ra buổi lễ tốt nghiệp và hướng dẫn đường đi, gửi xe thuận tiện nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Info Panel */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="luxury-card p-6 sm:p-7 rounded-3xl space-y-5">
              <div>
                <div className="text-xs font-sans text-amber-700 uppercase tracking-widest font-semibold mb-1">
                  ĐỊA ĐIỂM CHÍNH
                </div>
                <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-slate-900">
                  {GRADUATION_CONFIG.event.locationName}
                </h3>
                <p className="text-sm text-amber-800 font-medium mt-1">
                  {GRADUATION_CONFIG.event.hall}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">Địa chỉ:</span>
                    <p className="text-slate-600 mt-0.5">{GRADUATION_CONFIG.event.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Car className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">Bãi gửi xe:</span>
                    <p className="text-slate-600 mt-0.5">
                      Gửi xe tại Bãi giữ xe Cổng 1 (đối diện sảnh chính) hoặc Bãi xe nhà xe trung tâm.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">Lưu ý ngày lễ:</span>
                    <p className="text-slate-600 mt-0.5">
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
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:to-slate-700 text-amber-300 font-sans font-semibold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all border border-amber-500/30"
                >
                  <Navigation className="w-4 h-4 text-amber-400" />
                  <span>MỞ CHỈ ĐƯỜNG TRÊN GOOGLE MAPS</span>
                </a>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="luxury-card p-4 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500">Cần hỗ trợ chỉ đường?</span>
                <p className="font-bold text-slate-800">Hotline / Zalo: {GRADUATION_CONFIG.contact.phone}</p>
              </div>
              <a
                href={`tel:${GRADUATION_CONFIG.contact.phone.replace(/\s+/g, '')}`}
                onClick={() => sound.playClick()}
                className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold hover:bg-amber-100 transition-colors"
              >
                Gọi ngay
              </a>
            </div>
          </div>

          {/* Right Map Embed */}
          <div className="lg:col-span-7 luxury-card rounded-3xl overflow-hidden h-[380px] lg:h-auto min-h-[380px] relative shadow-md">
            <iframe
              src={GRADUATION_CONFIG.event.googleMapsEmbedUrl}
              className="w-full h-full border-0 absolute inset-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Graduation Venue Google Map"
            />
            {/* Map corner badge */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-amber-200/80 text-xs font-medium text-slate-800 pointer-events-none shadow-sm flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>{GRADUATION_CONFIG.event.hall}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
