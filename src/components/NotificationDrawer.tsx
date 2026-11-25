import React from 'react';
import { Bell, X, CalendarCheck2, ArrowRight, Calendar, Clock } from 'lucide-react';
import { ContentItem, STATUS_META } from '../types/content';
import {
  formatIndonesianDate,
  formatTimeWithZone,
  getRelativeDayLabel,
} from '../utils/dateUtils';
import { PlatformIcon } from './PlatformIcon';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  upcomingItems: ContentItem[];
  timezone: string;
  todayStr: string;
  onSelectContent: (item: ContentItem) => void;
  onGoToSchedule: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  upcomingItems,
  timezone,
  todayStr,
  onSelectContent,
  onGoToSchedule,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-start sm:justify-end bg-slate-950/40 backdrop-blur-xs sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pengingat Jadwal Konten"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:w-96 bg-white rounded-t-3xl sm:rounded-3xl border border-purple-100 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col sm:mt-14"
      >
        <div className="sm:hidden w-10 h-1.5 bg-purple-200 rounded-full mx-auto mt-3" />

        <div className="flex items-center justify-between px-5 py-4 border-b border-purple-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6D28D9] flex items-center justify-center">
              <Bell className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Pengingat Jadwal
              </h3>
              <p className="text-xs text-slate-500">
                {upcomingItems.length} konten dalam 7 hari ke depan
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pengingat"
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-500 hover:bg-purple-50 cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-2.5 flex-1">
          {upcomingItems.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-300 flex items-center justify-center mx-auto mb-3">
                <CalendarCheck2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Tidak ada jadwal mendesak
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Semua konten minggu ini sudah beres atau belum dijadwalkan.
              </p>
            </div>
          ) : (
            upcomingItems.map((item) => {
              const sMeta = STATUS_META[item.status];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectContent(item);
                    onClose();
                  }}
                  className="w-full text-left flex items-start gap-3 p-3 rounded-2xl border border-purple-100 hover:border-purple-300 hover:bg-purple-50/40 transition-colors cursor-pointer"
                >
                  <PlatformIcon platform={item.platform} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-bold">
                      <span className="text-[#6D28D9]">
                        {getRelativeDayLabel(item.date, todayStr)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${sMeta.bgClass} ${sMeta.textClass}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 truncate mt-1">
                      {item.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-600 mt-1 font-mono-num">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#6D28D9]" />
                        {formatIndonesianDate(item.date, { shortMonth: true })}
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                        <Clock className="w-3 h-3 text-[#6D28D9]" />
                        {formatTimeWithZone(item.time, timezone)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-purple-100 bg-purple-50/40">
          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToSchedule();
            }}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            <span>Lihat Semua Jadwal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
