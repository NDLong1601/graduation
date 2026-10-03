import React, { useState, useEffect } from 'react';
import { GRADUATION_CONFIG } from '../config';
import { sound } from '../utils/audioFx';
import { CalendarPlus, Download, Clock } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const CountdownSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const target = new Date(GRADUATION_CONFIG.event.isoDateTime).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Lễ Tốt Nghiệp - ${GRADUATION_CONFIG.graduate.fullName}`);
    const details = encodeURIComponent(
      `Tham dự Lễ Tốt Nghiệp cùng ${GRADUATION_CONFIG.graduate.fullName} - ${GRADUATION_CONFIG.graduate.major}. Rất mong được đón tiếp bạn!`
    );
    const location = encodeURIComponent(
      `${GRADUATION_CONFIG.event.locationName}, ${GRADUATION_CONFIG.event.address}`
    );
    const startDate = '20261016T060000Z'; // 13:00 UTC+7
    const endDate = '20261016T080000Z';   // 15:00 UTC+7

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDate}/${endDate}`;
  };

  const downloadIcs = () => {
    sound.playClick();
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Graduation Ceremony Invitation//VI',
      'BEGIN:VEVENT',
      `SUMMARY:Lễ Tốt Nghiệp - ${GRADUATION_CONFIG.graduate.fullName}`,
      `DESCRIPTION:Tham dự Lễ Tốt Nghiệp của ${GRADUATION_CONFIG.graduate.fullName}`,
      `LOCATION:${GRADUATION_CONFIG.event.locationName}, ${GRADUATION_CONFIG.event.address}`,
      'DTSTART:20261016T130000',
      'DTEND:20261016T150000',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Le_Tot_Nghiep_${GRADUATION_CONFIG.graduate.fullName.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const timerUnits = [
    { label: 'NGÀY', value: timeLeft.days },
    { label: 'GIỜ', value: timeLeft.hours },
    { label: 'PHÚT', value: timeLeft.minutes },
    { label: 'GIÂY', value: timeLeft.seconds },
  ];

  return (
    <section id="countdown" className="py-12 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 rounded-3xl p-6 sm:p-10 border border-[#C5A059]/30 text-center relative overflow-hidden shadow-xl shadow-slate-900/5">
          {/* Title */}
          <div className="relative z-10 space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#8A6D3B] px-3.5 py-1 rounded-full bg-[#F7F4EC] border border-[#C5A059]/35">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="tracking-wider uppercase">ĐỒNG HỒ ĐẾM NGƯỢC</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F172A] tracking-tight">
              Đếm Ngược Đến Giờ G
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {GRADUATION_CONFIG.event.date} — {GRADUATION_CONFIG.event.time}
            </p>
          </div>

          {/* Countdown Clock HUD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-2xl mx-auto mb-8 relative z-10">
            {timerUnits.map((unit, idx) => (
              <div
                key={idx}
                className="bg-[#FCFBF8] rounded-2xl p-4 sm:p-6 border border-[#C5A059]/30 shadow-sm"
              >
                <div className="text-3xl sm:text-5xl font-numeral font-bold text-[#0F172A] tracking-tight tabular-nums">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-[#8A6D3B] mt-1 uppercase tracking-widest">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          {/* Add to Calendar Buttons */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-[#F3E5AB] border border-[#C5A059]/40 text-xs sm:text-sm font-semibold transition-all hover:scale-105 shadow-md shadow-slate-900/10"
            >
              <CalendarPlus className="w-4 h-4 text-[#D4AF37]" />
              <span>Thêm vào Google Calendar</span>
            </a>

            <button
              onClick={downloadIcs}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-[#C5A059]/40 text-slate-800 text-xs sm:text-sm font-semibold transition-all hover:scale-105 shadow-sm"
            >
              <Download className="w-4 h-4 text-[#C5A059]" />
              <span>Tải file Lịch (.ics) cho iPhone/PC</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
