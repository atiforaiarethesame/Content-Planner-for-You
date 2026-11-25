import React from 'react';
import {
  ArrowRight,
  Plus,
  CalendarDays,
  Sparkles,
  Calendar,
  Clock,
} from 'lucide-react';
import {
  CONTENT_STATUSES,
  ContentItem,
  ContentStatus,
  CreatorSettings,
  STATUS_META,
} from '../types/content';
import {
  formatIndonesianDate,
  formatTimeWithZone,
  isDateInCurrentWeek,
} from '../utils/dateUtils';
import { CalendarWidget } from '../components/CalendarWidget';
import { ContentCard } from '../components/ContentCard';
import { StatusIcon } from '../components/StatusControl';
import { PlatformIcon } from '../components/PlatformIcon';

interface HomeViewProps {
  items: ContentItem[];
  settings: CreatorSettings;
  todayStr: string;
  selectedDate: string;
  calendarYear: number;
  calendarMonth: number;
  onSelectDate: (dateStr: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onJumpToday: () => void;
  onOpenCreate: (preselectedDate?: string) => void;
  onEditItem: (item: ContentItem) => void;
  onDuplicateItem: (item: ContentItem) => void;
  onDeleteItem: (item: ContentItem) => void;
  onStatusChange: (id: string, status: ContentStatus) => void;
  onGoToContent: (statusFilter?: ContentStatus | 'Semua') => void;
  onGoToCalendar: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  items,
  settings,
  todayStr,
  selectedDate,
  calendarYear,
  calendarMonth,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onJumpToday,
  onOpenCreate,
  onEditItem,
  onDuplicateItem,
  onDeleteItem,
  onStatusChange,
  onGoToContent,
  onGoToCalendar,
}) => {
  const thisWeekCount = React.useMemo(() => {
    return items.filter(
      (item) =>
        isDateInCurrentWeek(item.date, todayStr, settings.weekStartsOn) &&
        item.status !== 'Sudah Dipublikasikan'
    ).length;
  }, [items, todayStr, settings.weekStartsOn]);

  const nextUpcoming = React.useMemo(() => {
    const upcoming = items
      .filter(
        (item) =>
          item.date >= todayStr && item.status !== 'Sudah Dipublikasikan'
      )
      .sort((a, b) =>
        `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
      );
    return upcoming[0] || null;
  }, [items, todayStr]);

  const selectedDayItems = React.useMemo(() => {
    return items
      .filter((item) => item.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [items, selectedDate]);

  const statusCounts = React.useMemo(() => {
    const counts: Record<ContentStatus, number> = {
      Terjadwal: 0,
      'Sedang Diproses': 0,
      'Siap Publikasi': 0,
      'Sudah Dipublikasikan': 0,
    };
    for (const item of items) {
      counts[item.status] += 1;
    }
    return counts;
  }, [items]);

  return (
    <div className="space-y-6">
      {/* Greeting Header + Prominent Add Button (visible on all screen sizes) */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Hai, {settings.creatorName}!
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Atur jadwal kontenmu dengan lebih mudah dan terencana.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenCreate(selectedDate)}
          className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-bold shadow-md shadow-purple-700/20 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Konten</span>
        </button>
      </section>

      {/* Hero Purple Summary Banner */}
      <button
        type="button"
        onClick={() => onGoToContent('Semua')}
        className="w-full text-left rounded-3xl bg-gradient-to-r from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] text-white p-4 sm:px-6 sm:py-5 shadow-md shadow-purple-900/20 hover:shadow-lg transition-all flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-purple-100" />
          </div>
          <div className="flex items-baseline gap-3 min-w-0">
            <span className="font-mono-num text-3xl sm:text-4xl font-extrabold text-white leading-none">
              {thisWeekCount}
            </span>
            <div className="min-w-0">
              <span className="block text-sm sm:text-base font-bold text-white leading-tight">
                Konten Aktif Minggu Ini
              </span>
              <span className="block text-xs text-purple-100 mt-0.5 truncate">
                Ketuk untuk melihat semua daftar jadwal
              </span>
            </div>
          </div>
        </div>

        <span className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center shrink-0 transition-colors">
          <ArrowRight className="w-5 h-5 text-white" />
        </span>
      </button>

      {/* Main Responsive 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: High-Clarity Calendar */}
        <div className="lg:col-span-6 space-y-4">
          <CalendarWidget
            year={calendarYear}
            monthIndex={calendarMonth}
            selectedDate={selectedDate}
            todayStr={todayStr}
            weekStartsOn={settings.weekStartsOn}
            items={items}
            onSelectDate={onSelectDate}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
            onJumpToday={onJumpToday}
          />
        </div>

        {/* Right Column: Upcoming Spotlight + Selected Date Agenda */}
        <div className="lg:col-span-6 space-y-6">
          {/* Jadwal Terdekat */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-extrabold text-slate-900">
                Jadwal Terdekat
              </h2>
              <button
                type="button"
                onClick={() => onGoToContent('Semua')}
                className="inline-flex items-center gap-1.5 min-h-[40px] px-2 text-sm font-bold text-[#6D28D9] hover:text-[#5B21B6] transition-colors cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {nextUpcoming ? (
              <ContentCard
                item={nextUpcoming}
                timezone={settings.timezone}
                todayStr={todayStr}
                onStatusChange={onStatusChange}
                onEdit={onEditItem}
                onDuplicate={onDuplicateItem}
                onDelete={onDeleteItem}
                highlight
              />
            ) : (
              <div className="rounded-3xl bg-white border border-purple-100 p-6 text-center">
                <p className="text-sm font-bold text-slate-800">
                  Belum ada jadwal konten mendatang
                </p>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Mulai jadwalkan postingan pertamamu agar tetap konsisten.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenCreate(todayStr)}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-[#6D28D9] text-white text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Jadwal Baru</span>
                </button>
              </div>
            )}
          </section>

          {/* Agenda untuk Tanggal Terpilih */}
          <section className="bg-white rounded-3xl border border-purple-100 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-purple-50">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Jadwal{' '}
                  {formatIndonesianDate(selectedDate, { withWeekday: true })}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedDayItems.length > 0
                    ? `${selectedDayItems.length} konten direncanakan pada tanggal ini`
                    : 'Belum ada konten di tanggal ini'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenCreate(selectedDate)}
                className="min-h-[38px] px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-[#5B21B6] text-xs font-bold inline-flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>

            {selectedDayItems.length === 0 ? (
              <div className="py-5 text-center">
                <CalendarDays className="w-7 h-7 text-purple-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">
                  Tanggal ini masih kosong. Ketuk tombol{' '}
                  <strong className="text-purple-800">+ Tambah</strong> untuk
                  menjadwalkan konten.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {selectedDayItems.map((item) => {
                  const sMeta = STATUS_META[item.status];
                  return (
                    <div
                      key={item.id}
                      onClick={() => onEditItem(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onEditItem(item);
                        }
                      }}
                      className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-purple-100 hover:border-purple-300 hover:bg-purple-50/40 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <PlatformIcon platform={item.platform} size="sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {item.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-600 mt-0.5">
                            <span className="font-semibold text-purple-800">
                              {item.platform}
                            </span>
                            <span className="inline-flex items-center gap-1 font-mono-num">
                              <Calendar className="w-3 h-3 text-[#6D28D9]" />
                              {formatIndonesianDate(item.date, {
                                shortMonth: true,
                              })}
                            </span>
                            <span className="inline-flex items-center gap-1 font-mono-num font-bold text-slate-900">
                              <Clock className="w-3 h-3 text-[#6D28D9]" />
                              {formatTimeWithZone(item.time, settings.timezone)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-bold ${sMeta.bgClass} ${sMeta.textClass} ${sMeta.borderClass}`}
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: sMeta.dotColor }}
                          />
                          <StatusIcon status={item.status} className="w-3 h-3" />
                          <span className="hidden sm:inline">{item.status}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={onGoToCalendar}
                  className="w-full min-h-[40px] mt-1 text-xs font-bold text-[#6D28D9] hover:underline text-center cursor-pointer"
                >
                  Buka tampilan kalender lengkap →
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Ringkasan Status Konten (4 Warna Berbeda) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-extrabold text-slate-900">
            Status Produksi Konten
          </h2>
          <span className="text-xs text-slate-500">
            Ketuk status untuk memfilter daftar
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {CONTENT_STATUSES.map((status) => {
            const meta = STATUS_META[status];
            return (
              <button
                key={status}
                type="button"
                onClick={() => onGoToContent(status)}
                className={`text-left rounded-2xl border p-4 transition-all hover:shadow-sm cursor-pointer ${meta.bgClass} ${meta.borderClass}`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`p-2 rounded-xl bg-white/80 ${meta.textClass}`}
                  >
                    <StatusIcon status={status} className="w-4 h-4" />
                  </span>
                  <span
                    className={`font-mono-num text-2xl font-extrabold ${meta.textClass}`}
                  >
                    {statusCounts[status]}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: meta.dotColor }}
                  />
                  <p className={`text-xs font-extrabold ${meta.textClass}`}>
                    {meta.label}
                  </p>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                  {meta.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
