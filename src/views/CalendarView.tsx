import React, { useState, useMemo } from 'react';
import {
  Plus,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  ContentItem,
  ContentStatus,
  CreatorSettings,
  PLATFORMS,
  Platform,
  STATUS_META,
} from '../types/content';
import {
  INDONESIAN_DAYS_FULL,
  formatIndonesianDate,
  getWeekDates,
  parseISODate,
} from '../utils/dateUtils';
import { CalendarWidget } from '../components/CalendarWidget';
import { ContentCard } from '../components/ContentCard';

interface CalendarViewProps {
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
}

export const CalendarView: React.FC<CalendarViewProps> = ({
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
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'Semua'>(
    'Semua'
  );

  const filteredItems = useMemo(() => {
    if (platformFilter === 'Semua') return items;
    return items.filter((item) => item.platform === platformFilter);
  }, [items, platformFilter]);

  const weekDates = useMemo(
    () => getWeekDates(selectedDate, settings.weekStartsOn),
    [selectedDate, settings.weekStartsOn]
  );

  const selectedDayItems = useMemo(() => {
    return filteredItems
      .filter((item) => item.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [filteredItems, selectedDate]);

  const shiftWeek = (deltaDays: number) => {
    const d = parseISODate(selectedDate);
    d.setDate(d.getDate() + deltaDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    onSelectDate(`${y}-${m}-${day}`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950">
            Kalender Konten
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Pantau distribusi jadwal publikasi per bulan atau per minggu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Segmented Month / Week Toggle */}
          <div className="inline-flex items-center p-1 bg-purple-100/80 rounded-xl">
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`min-h-[36px] px-3.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-white text-[#5B21B6] shadow-xs'
                  : 'text-slate-600 hover:text-purple-900'
              }`}
            >
              Bulan
            </button>
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`min-h-[36px] px-3.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-white text-[#5B21B6] shadow-xs'
                  : 'text-slate-600 hover:text-purple-900'
              }`}
            >
              Minggu
            </button>
          </div>

          <button
            type="button"
            onClick={() => onOpenCreate(selectedDate)}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Konten</span>
          </button>
        </div>
      </div>

      {/* Platform Filter Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {(['Semua', ...PLATFORMS] as const).map((plat) => (
          <button
            key={plat}
            type="button"
            onClick={() => setPlatformFilter(plat)}
            className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              platformFilter === plat
                ? 'bg-[#6D28D9] text-white'
                : 'bg-white border border-purple-100 text-slate-600 hover:bg-purple-50'
            }`}
          >
            {plat === 'Semua' ? 'Semua Platform' : plat}
          </button>
        ))}
      </div>

      {/* Responsive Split: Calendar Left, Agenda Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6">
          {viewMode === 'month' ? (
            <CalendarWidget
              year={calendarYear}
              monthIndex={calendarMonth}
              selectedDate={selectedDate}
              todayStr={todayStr}
              weekStartsOn={settings.weekStartsOn}
              items={filteredItems}
              onSelectDate={onSelectDate}
              onPrevMonth={onPrevMonth}
              onNextMonth={onNextMonth}
              onJumpToday={onJumpToday}
            />
          ) : (
            <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] text-white px-4 py-4 sm:px-5 flex items-center justify-between gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Jadwal Mingguan
                </h3>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={onJumpToday}
                    className="min-h-[36px] px-2.5 py-1 rounded-xl bg-white text-purple-950 text-xs font-bold cursor-pointer"
                  >
                    Minggu Ini
                  </button>
                  <button
                    type="button"
                    onClick={() => shiftWeek(-7)}
                    aria-label="Minggu sebelumnya"
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 text-white cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => shiftWeek(7)}
                    aria-label="Minggu berikutnya"
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 text-white cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-7 gap-1.5">
                  {weekDates.map((dStr) => {
                    const dateObj = parseISODate(dStr);
                    const dayItems = filteredItems.filter(
                      (i) => i.date === dStr
                    );
                    const isSelected = dStr === selectedDate;
                    const isToday = dStr === todayStr;

                    return (
                      <button
                        key={dStr}
                        type="button"
                        onClick={() => onSelectDate(dStr)}
                        className={`flex flex-col items-center py-3 px-1 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#6D28D9] border-[#6D28D9] text-white shadow-md'
                            : isToday
                            ? 'bg-purple-50 border-purple-400 text-purple-950'
                            : 'bg-white border-purple-100 hover:bg-purple-50/40 text-slate-800'
                        }`}
                      >
                        <span
                          className={`text-[10px] font-bold uppercase ${
                            isSelected ? 'text-purple-200' : 'text-slate-500'
                          }`}
                        >
                          {INDONESIAN_DAYS_FULL[dateObj.getDay()].slice(0, 3)}
                        </span>
                        <span className="font-mono-num text-base font-extrabold mt-1">
                          {dateObj.getDate()}
                        </span>
                        <div className="flex items-center justify-center gap-0.5 mt-1.5 h-2.5">
                          {dayItems.slice(0, 3).map((item) => (
                            <span
                              key={item.id}
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelected ? 'ring-1 ring-white/80' : ''
                              }`}
                              style={{
                                backgroundColor:
                                  STATUS_META[item.status].dotColor,
                              }}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Compact summary of all items in this week */}
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                  <p className="text-xs font-bold text-slate-600">
                    Ringkasan Minggu Ini
                  </p>
                  {weekDates.map((dStr) => {
                    const dayPosts = filteredItems.filter(
                      (i) => i.date === dStr
                    );
                    if (dayPosts.length === 0) return null;
                    return (
                      <button
                        key={dStr}
                        type="button"
                        onClick={() => onSelectDate(dStr)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-purple-50/60 hover:bg-purple-100/70 text-left transition-colors cursor-pointer"
                      >
                        <span className="text-xs font-semibold text-slate-800">
                          {formatIndonesianDate(dStr, {
                            shortMonth: true,
                            withWeekday: true,
                          })}
                        </span>
                        <span className="text-xs font-mono-num font-bold text-[#6D28D9]">
                          {dayPosts.length} konten
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selected Date Agenda Panel */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl border border-purple-100 p-4 sm:p-5 flex items-center justify-between gap-3 shadow-xs">
            <div>
              <p className="text-xs font-bold text-[#6D28D9]">
                Agenda Tanggal Terpilih
              </p>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                {formatIndonesianDate(selectedDate, { withWeekday: true })}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onOpenCreate(selectedDate)}
              className="min-h-[42px] px-4 py-2 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Jadwalkan</span>
            </button>
          </div>

          {selectedDayItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-purple-100 p-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-300 flex items-center justify-center mx-auto mb-3">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Belum ada jadwal pada tanggal ini
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Tambahkan konten untuk menjaga ritme upload tetap konsisten.
              </p>
              <button
                type="button"
                onClick={() => onOpenCreate(selectedDate)}
                className="mt-4 min-h-[42px] px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-[#5B21B6] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah di Tanggal Ini</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayItems.map((item) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  timezone={settings.timezone}
                  todayStr={todayStr}
                  onStatusChange={onStatusChange}
                  onEdit={onEditItem}
                  onDuplicate={onDuplicateItem}
                  onDelete={onDeleteItem}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
