import React, { useMemo } from 'react';
import {
  BarChart3,
  CheckCircle2,
  CalendarClock,
  Layers,
  Lightbulb,
  Plus,
} from 'lucide-react';
import {
  CONTENT_STATUSES,
  ContentItem,
  ContentStatus,
  CreatorSettings,
  PLATFORMS,
  PLATFORM_META,
  Platform,
  STATUS_META,
} from '../types/content';
import {
  INDONESIAN_DAYS_FULL,
  isDateInCurrentWeek,
  parseISODate,
  toISODate,
} from '../utils/dateUtils';
import { PlatformIcon } from '../components/PlatformIcon';
import { StatusIcon } from '../components/StatusControl';

interface AnalyticsViewProps {
  items: ContentItem[];
  settings: CreatorSettings;
  todayStr: string;
  onOpenCreate: () => void;
  onGoToContent: (statusFilter?: ContentStatus | 'Semua') => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  items,
  settings,
  todayStr,
  onOpenCreate,
  onGoToContent,
}) => {
  const totalCount = items.length;

  const publishedCount = useMemo(
    () => items.filter((i) => i.status === 'Sudah Dipublikasikan').length,
    [items]
  );

  const readyCount = useMemo(
    () => items.filter((i) => i.status === 'Siap Publikasi').length,
    [items]
  );

  const thisWeekCount = useMemo(
    () =>
      items.filter((i) =>
        isDateInCurrentWeek(i.date, todayStr, settings.weekStartsOn)
      ).length,
    [items, todayStr, settings.weekStartsOn]
  );

  const completionRate =
    totalCount > 0 ? Math.round((publishedCount / totalCount) * 100) : 0;

  const platformStats = useMemo(() => {
    const counts: Record<Platform, number> = {
      Instagram: 0,
      TikTok: 0,
      YouTube: 0,
      X: 0,
      LinkedIn: 0,
      Facebook: 0,
    };
    for (const item of items) {
      counts[item.platform] += 1;
    }
    return PLATFORMS.map((p) => ({
      platform: p,
      count: counts[p],
      percent: totalCount > 0 ? Math.round((counts[p] / totalCount) * 100) : 0,
    })).sort((a, b) => b.count - a.count);
  }, [items, totalCount]);

  const topPlatform =
    platformStats[0] && platformStats[0].count > 0
      ? platformStats[0].platform
      : 'Belum ada';

  const statusStats = useMemo(() => {
    return CONTENT_STATUSES.map((s) => {
      const count = items.filter((i) => i.status === s).length;
      const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
      return { status: s, count, percent };
    });
  }, [items, totalCount]);

  const next7Days = useMemo(() => {
    const base = parseISODate(todayStr);
    const days = Array.from({ length: 7 }, (_, idx) => {
      const d = new Date(base);
      d.setDate(base.getDate() + idx);
      const iso = toISODate(d);
      const count = items.filter((i) => i.date === iso).length;
      return {
        dateStr: iso,
        shortDay: INDONESIAN_DAYS_FULL[d.getDay()].slice(0, 3),
        dayNum: d.getDate(),
        count,
      };
    });
    const maxCount = Math.max(1, ...days.map((d) => d.count));
    return { days, maxCount };
  }, [items, todayStr]);

  const emptyDaysAhead = next7Days.days.filter((d) => d.count === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950">
            Analitik Konten
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Pantau konsistensi jadwal dan kesiapan publikasimu secara ringkas.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-bold shadow-md shadow-purple-700/20 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Konten</span>
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl border border-purple-100 p-4">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Rencana</span>
            <Layers className="w-4 h-4 text-[#6D28D9]" />
          </div>
          <p className="font-mono-num text-2xl sm:text-3xl font-extrabold text-slate-950">
            {totalCount}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {thisWeekCount} konten minggu ini
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-purple-100 p-4">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Sudah Tayang</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-mono-num text-2xl sm:text-3xl font-extrabold text-slate-950">
            {completionRate}%
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {publishedCount} dari {totalCount} selesai
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-purple-100 p-4">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Siap Publikasi</span>
            <CalendarClock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-mono-num text-2xl sm:text-3xl font-extrabold text-slate-950">
            {readyCount}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Siap unggah sesuai jam
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-purple-100 p-4">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Platform Utama</span>
            <BarChart3 className="w-4 h-4 text-[#6D28D9]" />
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-950 truncate">
            {topPlatform}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Fokus kanal tersibukmu
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-white rounded-3xl border border-purple-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Kepadatan Jadwal 7 Hari ke Depan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Jumlah konten terjadwal per hari mulai hari ini
              </p>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 items-end h-44 pt-4">
            {next7Days.days.map((day, idx) => {
              const heightPercent =
                day.count === 0
                  ? 8
                  : Math.max(
                      22,
                      Math.round((day.count / next7Days.maxCount) * 100)
                    );
              const isToday = idx === 0;
              return (
                <div
                  key={day.dateStr}
                  className="flex flex-col items-center h-full justify-end gap-2"
                >
                  <span className="font-mono-num text-xs font-bold text-slate-700">
                    {day.count}
                  </span>
                  <div className="w-full max-w-[38px] flex-1 flex items-end justify-center bg-purple-50 rounded-xl p-1">
                    <div
                      className={`w-full rounded-lg transition-all duration-300 ${
                        day.count === 0
                          ? 'bg-purple-100'
                          : isToday
                          ? 'bg-[#A855F7]'
                          : 'bg-[#6D28D9]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <span className="block text-[11px] font-bold text-slate-700">
                      {day.shortDay}
                    </span>
                    <span className="block font-mono-num text-[10px] text-slate-400">
                      {day.dayNum}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Pipeline Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-purple-100 p-5">
          <h2 className="text-base font-extrabold text-slate-900 mb-1">
            Status Produksi
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Ketuk baris status untuk langsung memfilter daftar konten
          </p>

          <div className="space-y-3.5">
            {statusStats.map(({ status, count, percent }) => {
              const meta = STATUS_META[status];
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => onGoToContent(status)}
                  className="w-full text-left group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 group-hover:text-[#6D28D9]">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: meta.dotColor }}
                      />
                      <StatusIcon status={status} className="w-3.5 h-3.5" />
                      <span>{status}</span>
                    </span>
                    <span className="font-mono-num font-bold text-slate-700">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: meta.dotColor,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Platform Distribution + Beginner Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-white rounded-3xl border border-purple-100 p-5">
          <h2 className="text-base font-extrabold text-slate-900 mb-4">
            Distribusi Platform Media Sosial
          </h2>
          <div className="space-y-3">
            {platformStats.map(({ platform, count, percent }) => (
              <div key={platform} className="flex items-center gap-3">
                <PlatformIcon platform={platform} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-800">{platform}</span>
                    <span className="font-mono-num text-slate-600">
                      {count} konten · {percent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-purple-50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: PLATFORM_META[platform].accentColor,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Beginner Creator Tip Card */}
        <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] text-white p-5 flex flex-col justify-between shadow-md shadow-purple-900/20">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-white text-[#6D28D9] flex items-center justify-center mb-4">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-extrabold">
              Saran Konsistensi Untukmu
            </h2>
            <p className="text-sm text-purple-100 mt-2 leading-relaxed">
              {totalCount === 0
                ? 'Kamu belum memiliki jadwal konten. Mulailah dengan merencanakan 2 hingga 3 konten sederhana minggu ini agar kebiasaan upload terbentuk.'
                : emptyDaysAhead >= 4
                ? `Masih ada ${emptyDaysAhead} hari kosong dalam 7 hari ke depan. Coba isi minimal 1 ide konten ringan agar audiens tetap aktif berinteraksi.`
                : 'Jadwalmu minggu ini sudah terjaga dengan baik! Pastikan konten berstatus "Sedang Diproses" segera diselesaikan sebelum hari tayang.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCreate}
            className="mt-5 min-h-[44px] w-full rounded-2xl bg-white text-[#5B21B6] hover:bg-purple-50 text-xs font-extrabold transition-colors cursor-pointer"
          >
            + Tambah Jadwal Baru
          </button>
        </div>
      </div>
    </div>
  );
};
