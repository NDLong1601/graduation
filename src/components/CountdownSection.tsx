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

  // Google Calendar link generator
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Lễ Tốt Nghiệp - ${GRADUATION_CONFIG.graduate.fullName}`);
    const details = encodeURIComponent(
      `Tham dự Lễ Tốt Nghiệp cùng ${GRADUATION_CONFIG.graduate.fullName} - ${GRADUATION_CONFIG.graduate.major}. Rất mong được đón tiếp bạn!`
    );
    const location = encodeURIComponent(
      `${GRADUATION_CONFIG.event.locationName}, ${GRADUATION_CONFIG.event.address}`
    );
    // Format: YYYYMMDDTHHmmssZ
    const startDate = '20261115T003000Z'; // 07:30 UTC+7
    const endDate = '20261115T050000Z';   // 12:00 UTC+7

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDate}/${endDate}`;
  };

  // Download .ics file
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
      'DTSTART:20261115T073000',
      'DTEND:20261115T120000',
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
    { label: 'NGÀY', value: timeLeft.days, color: 'text-rose-400', border: 'border-rose-500/30' },
    { label: 'GIỜ', value: timeLeft.hours, color: 'text-amber-300', border: 'border-amber-500/30' },
    { label: 'PHÚT', value: timeLeft.minutes, color: 'text-pink-400', border: 'border-pink-500/30' },
    { label: 'GIÂY', value: timeLeft.seconds, color: 'text-emerald-400', border: 'border-emerald-500/30' },
  ];

  return (
    <section id="countdown" className="py-12 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cyber-card rounded-3xl p-6 sm:p-10 border-rose-500/20 text-center relative overflow-hidden">
          {/* Subtle radar scanline background effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 via-transparent to-amber-500/5 pointer-events-none" />

          {/* Title */}
          <div className="relative z-10 space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-mono-code text-rose-300 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>TIME_COUNTDOWN // CHẠM TAY VÀO KHOẢNH KHẮC</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-tech font-bold text-white tracking-wide">
              ĐẾM NGƯỢC ĐẾN GIỜ G
            </h2>
            <p className="text-xs sm:text-sm text-rose-200/80">
              {GRADUATION_CONFIG.event.date} — {GRADUATION_CONFIG.event.time}
            </p>
          </div>

          {/* Countdown Clock HUD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-2xl mx-auto mb-8 relative z-10">
            {timerUnits.map((unit, idx) => (
              <div
                key={idx}
                className={`relative bg-rose-950/50 backdrop-blur-md rounded-2xl p-4 sm:p-6 border ${unit.border} shadow-lg shadow-rose-950/40`}
              >
                <div className={`text-3xl sm:text-5xl font-tech font-extrabold ${unit.color} tracking-wider`}>
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="text-[10px] sm:text-xs font-mono-code text-rose-300/70 mt-1 uppercase tracking-widest">
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-950/70 hover:bg-rose-900/70 border border-rose-500/40 text-rose-200 text-xs sm:text-sm font-semibold transition-all hover:scale-105 shadow-md shadow-rose-950/40"
            >
              <CalendarPlus className="w-4 h-4 text-rose-400" />
              <span>Thêm vào Google Calendar</span>
            </a>

            <button
              onClick={downloadIcs}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-950/70 hover:bg-amber-900/70 border border-amber-500/40 text-amber-200 text-xs sm:text-sm font-semibold transition-all hover:scale-105 shadow-md shadow-amber-950/40"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Tải file Lịch (.ics) cho iPhone/PC</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
