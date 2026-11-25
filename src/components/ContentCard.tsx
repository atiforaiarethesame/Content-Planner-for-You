import React from 'react';
import { Pencil, Trash2, Copy, Calendar, Clock } from 'lucide-react';
import { ContentItem, ContentStatus, STATUS_META } from '../types/content';
import {
  formatIndonesianDate,
  formatTimeWithZone,
  getRelativeDayLabel,
} from '../utils/dateUtils';
import { PlatformIcon } from './PlatformIcon';
import { StatusControl } from './StatusControl';

interface ContentCardProps {
  item: ContentItem;
  timezone: string;
  todayStr: string;
  onStatusChange: (id: string, status: ContentStatus) => void;
  onEdit: (item: ContentItem) => void;
  onDuplicate: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
  highlight?: boolean;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  item,
  timezone,
  todayStr,
  onStatusChange,
  onEdit,
  onDuplicate,
  onDelete,
  highlight = false,
}) => {
  const relativeLabel = getRelativeDayLabel(item.date, todayStr);
  const statusMeta = STATUS_META[item.status];

  if (highlight) {
    return (
      <div
        onClick={() => onEdit(item)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onEdit(item);
          }
        }}
        className="w-full text-left rounded-3xl bg-gradient-to-br from-[#5B21B6] via-[#6D28D9] to-[#7C3AED] text-white p-4 sm:p-5 shadow-md shadow-purple-900/20 hover:shadow-lg transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
      >
        <div className="flex items-start gap-3.5">
          <PlatformIcon platform={item.platform} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-purple-100">
                {item.platform} · {relativeLabel}
              </span>
              <StatusControl
                status={item.status}
                onChange={(nextStatus) => onStatusChange(item.id, nextStatus)}
                variant="on-purple"
              />
            </div>

            <h4 className="text-base sm:text-lg font-extrabold text-white leading-snug mt-1.5 line-clamp-2">
              {item.title}
            </h4>

            {/* Clear Schedule Info Row */}
            <div className="mt-3 pt-3 border-t border-white/15 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-white">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Calendar className="w-4 h-4 text-purple-200 shrink-0" />
                <span className="font-mono-num">
                  {formatIndonesianDate(item.date, { withWeekday: true })}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-bold">
                <Clock className="w-4 h-4 text-purple-200 shrink-0" />
                <span className="font-mono-num">
                  {formatTimeWithZone(item.time, timezone)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="bg-white rounded-2xl border border-purple-100 p-4 sm:p-5 hover:border-purple-300 shadow-xs transition-colors">
      <div className="flex items-start gap-3.5">
        <PlatformIcon platform={item.platform} size="md" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-bold text-purple-800">
              {item.platform} · {relativeLabel}
            </span>
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: statusMeta.dotColor }}
              title={item.status}
            />
          </div>

          <h4 className="text-base font-extrabold text-slate-900 leading-snug">
            {item.title}
          </h4>

          {item.description && (
            <p className="text-sm text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Dedicated High-Clarity Date & Time Block */}
          <div className="mt-3 px-3 py-2 rounded-xl bg-purple-50/70 border border-purple-100/80 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-[#6D28D9] shrink-0" />
              <span className="font-mono-num">
                {formatIndonesianDate(item.date, {
                  shortMonth: true,
                  withWeekday: true,
                })}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-bold text-[#5B21B6]">
              <Clock className="w-3.5 h-3.5 text-[#6D28D9] shrink-0" />
              <span className="font-mono-num">
                {formatTimeWithZone(item.time, timezone)}
              </span>
            </span>
          </div>

          {/* Bottom interactive bar */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <StatusControl
              status={item.status}
              onChange={(nextStatus) => onStatusChange(item.id, nextStatus)}
            />

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onEdit(item)}
                aria-label={`Edit ${item.title}`}
                title="Edit konten"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-500 hover:text-[#6D28D9] hover:bg-purple-50 transition-colors cursor-pointer"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDuplicate(item)}
                aria-label={`Duplikat ${item.title}`}
                title="Duplikat konten"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-500 hover:text-[#6D28D9] hover:bg-purple-50 transition-colors cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(item)}
                aria-label={`Hapus ${item.title}`}
                title="Hapus konten"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
