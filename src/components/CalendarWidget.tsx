import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CONTENT_STATUSES, ContentItem, STATUS_META } from '../types/content';
import {
  INDONESIAN_DAYS_SHORT_MON,
  INDONESIAN_DAYS_SHORT_SUN,
  INDONESIAN_MONTHS,
  getMonthCalendarDays,
} from '../utils/dateUtils';

interface CalendarWidgetProps {
  year: number;
  monthIndex: number;
  selectedDate: string;
  todayStr: string;
  weekStartsOn: 'sunday' | 'monday';
  items: ContentItem[];
  onSelectDate: (dateStr: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onJumpToday?: () => void;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  year,
  monthIndex,
  selectedDate,
  todayStr,
  weekStartsOn,
  items,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onJumpToday,
}) => {
  const daysHeader =
    weekStartsOn === 'monday'
      ? INDONESIAN_DAYS_SHORT_MON
      : INDONESIAN_DAYS_SHORT_SUN;
  const cells = getMonthCalendarDays(year, monthIndex, weekStartsOn);

  const itemsByDate = React.useMemo(() => {
    const map: Record<string, ContentItem[]> = {};
    for (const item of items) {
      if (!map[item.date]) map[item.date] = [];
      map[item.date].push(item);
    }
    return map;
  }, [items]);

  return (
    <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
      {/* High-contrast Royal Purple Header */}
      <div className="bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] text-white px-4 py-4 sm:px-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="block text-xs font-semibold text-purple-200 font-mono-num">
            {year}
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white truncate">
            {INDONESIAN_MONTHS[monthIndex]}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onJumpToday && (
            <button
              type="button"
              onClick={onJumpToday}
              className="min-h-[38px] px-3 py-1.5 text-xs font-bold text-purple-950 bg-white hover:bg-purple-50 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              Hari Ini
            </button>
          )}
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="Bulan sebelumnya"
            className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Bulan berikutnya"
            className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <div className="p-3.5 sm:p-5">
        {/* Clean Lavender Weekday Strip */}
        <div className="grid grid-cols-7 rounded-2xl bg-purple-50 py-2 px-1 mb-2.5">
          {daysHeader.map((day) => {
            const isWeekend = day === 'MIN' || day === 'SAB';
            return (
              <div
                key={day}
                className={`text-center text-[11px] font-extrabold tracking-wider ${
                  isWeekend ? 'text-purple-700' : 'text-slate-700'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Spacious, High-Legibility Date Cells */}
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((cell) => {
            const dayItems = itemsByDate[cell.dateStr] || [];
            const isSelected = cell.dateStr === selectedDate;
            const isToday = cell.dateStr === todayStr;
            const hasItems = dayItems.length > 0;

            return (
              <button
                key={cell.dateStr}
                type="button"
                onClick={() => onSelectDate(cell.dateStr)}
                aria-label={`Tanggal ${cell.dateStr}${
                  hasItems ? `, ${dayItems.length} konten terjadwal` : ''
                }`}
                className={`relative flex flex-col items-center justify-between py-2 px-1 h-13 sm:h-15 rounded-2xl border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-purple-600 ${
                  !cell.isCurrentMonth
                    ? 'opacity-35 border-transparent'
                    : isSelected
                    ? 'bg-[#6D28D9] border-[#6D28D9] text-white shadow-md shadow-purple-700/25'
                    : isToday
                    ? 'bg-purple-50 border-purple-400 text-purple-950 ring-1 ring-purple-300'
                    : hasItems
                    ? 'bg-white border-purple-100 hover:border-purple-300 hover:bg-purple-50/40 text-slate-900'
                    : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="w-full flex items-center justify-center relative">
                  <span
                    className={`font-mono-num text-sm sm:text-[15px] font-bold leading-none ${
                      isSelected
                        ? 'text-white'
                        : isToday
                        ? 'text-purple-900'
                        : 'text-slate-900'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>
                </div>

                {/* Clear Status Indicators + Count */}
                {hasItems ? (
                  <div className="flex items-center justify-center gap-0.5 mt-1">
                    {dayItems.slice(0, 3).map((item) => (
                      <span
                        key={item.id}
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'ring-1 ring-white/80' : ''
                        }`}
                        style={{
                          backgroundColor: STATUS_META[item.status].dotColor,
                        }}
                      />
                    ))}
                    {dayItems.length > 1 && (
                      <span
                        className={`ml-0.5 font-mono-num text-[10px] font-extrabold leading-none ${
                          isSelected ? 'text-purple-100' : 'text-purple-700'
                        }`}
                      >
                        {dayItems.length}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="h-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Beginner-Friendly Color Legend */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2">
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[11px] font-medium text-slate-600">
            {CONTENT_STATUSES.map((status) => (
              <span key={status} className="inline-flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: STATUS_META[status].dotColor }}
                />
                <span>{status}</span>
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-purple-50 border border-purple-400 inline-block" />
              <span>Hari Ini</span>
            </span>
            <span>Ketuk tanggal untuk melihat atau menambah jadwal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
