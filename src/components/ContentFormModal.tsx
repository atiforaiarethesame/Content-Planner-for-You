import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Sparkles, Check } from 'lucide-react';
import {
  CONTENT_STATUSES,
  ContentItem,
  ContentStatus,
  PLATFORMS,
  PLATFORM_META,
  Platform,
  STATUS_META,
} from '../types/content';
import { PlatformIcon } from './PlatformIcon';
import { StatusIcon } from './StatusControl';

interface ContentFormModalProps {
  isOpen: boolean;
  editingItem: ContentItem | null;
  initialDate: string;
  defaultTime: string;
  timezone: string;
  onClose: () => void;
  onSave: (
    data: Omit<ContentItem, 'id' | 'createdAt'>,
    existingId?: string
  ) => void;
}

const PRIME_TIME_PRESETS = ['09:00', '12:00', '16:00', '19:00', '20:30'];

export const ContentFormModal: React.FC<ContentFormModalProps> = ({
  isOpen,
  editingItem,
  initialDate,
  defaultTime,
  timezone,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState<Platform>('Instagram');
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(defaultTime);
  const [status, setStatus] = useState<ContentStatus>('Terjadwal');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (editingItem) {
      setTitle(editingItem.title);
      setDescription(editingItem.description);
      setPlatform(editingItem.platform);
      setDate(editingItem.date);
      setTime(editingItem.time);
      setStatus(editingItem.status);
    } else {
      setTitle('');
      setDescription('');
      setPlatform('Instagram');
      setDate(initialDate);
      setTime(defaultTime);
      setStatus('Terjadwal');
    }
    setError('');
  }, [isOpen, editingItem, initialDate, defaultTime]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Judul konten wajib diisi agar mudah ditemukan di jadwal.');
      return;
    }
    if (!date) {
      setError('Pilih tanggal publikasi terlebih dahulu.');
      return;
    }
    if (!time) {
      setError('Tentukan waktu publikasi terlebih dahulu.');
      return;
    }

    onSave(
      {
        title: trimmedTitle,
        description: description.trim(),
        platform,
        date,
        time,
        status,
      },
      editingItem?.id
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/55 backdrop-blur-xs sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="content-form-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl border border-purple-100 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        <div className="sm:hidden w-10 h-1.5 bg-purple-200 rounded-full mx-auto mt-3 shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-purple-100 shrink-0">
          <div>
            <h2
              id="content-form-title"
              className="text-lg font-extrabold text-slate-900"
            >
              {editingItem ? 'Edit Jadwal Konten' : 'Tambah Konten Baru'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Isi detail konten agar siap dipublikasikan tepat waktu.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup form"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 hover:bg-purple-50 hover:text-purple-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-5 py-4 space-y-5 flex-1"
        >
          {error && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          {/* Judul Konten */}
          <div>
            <label
              htmlFor="content-title"
              className="block text-sm font-bold text-slate-800 mb-1.5"
            >
              Judul Konten <span className="text-red-500">*</span>
            </label>
            <input
              id="content-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="Contoh: Konten Reels : Tip Kuliah Produktif"
              className="w-full min-h-[46px] px-4 py-2.5 rounded-2xl border border-slate-200 bg-purple-50/30 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#6D28D9] focus:outline-none transition-colors"
            />
          </div>

          {/* Platform Media Sosial */}
          <div>
            <span className="block text-sm font-bold text-slate-800 mb-2">
              Platform Media Sosial
            </span>
            <div className="grid grid-cols-3 gap-2">
              {PLATFORMS.map((p) => {
                const isSelected = platform === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={`flex items-center gap-2 min-h-[48px] px-2.5 py-2 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#6D28D9] bg-purple-50 ring-1 ring-[#6D28D9]'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <PlatformIcon platform={p} size="sm" />
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {p}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Format umum {platform}: {PLATFORM_META[platform].formatHint}
            </p>
          </div>

          {/* Deskripsi Konten */}
          <div>
            <label
              htmlFor="content-description"
              className="block text-sm font-bold text-slate-800 mb-1.5"
            >
              Deskripsi / Ide Caption
            </label>
            <textarea
              id="content-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tulis poin utama, hook pembuka, atau catatan properti video di sini..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-purple-50/30 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#6D28D9] focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Tanggal & Waktu Publikasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor="content-date"
                className="flex items-center gap-1.5 text-sm font-bold text-slate-800 mb-1.5"
              >
                <Calendar className="w-4 h-4 text-[#6D28D9]" />
                <span>Tanggal Publikasi</span>
              </label>
              <input
                id="content-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-2xl border border-slate-200 bg-purple-50/30 font-mono-num text-sm text-slate-900 focus:bg-white focus:border-[#6D28D9] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="content-time"
                className="flex items-center gap-1.5 text-sm font-bold text-slate-800 mb-1.5"
              >
                <Clock className="w-4 h-4 text-[#6D28D9]" />
                <span>Waktu ({timezone})</span>
              </label>
              <input
                id="content-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2 rounded-2xl border border-slate-200 bg-purple-50/30 font-mono-num text-sm text-slate-900 focus:bg-white focus:border-[#6D28D9] focus:outline-none"
              />
            </div>
          </div>

          {/* Prime time quick buttons */}
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
              Jam Ramai (Prime Time):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRIME_TIME_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTime(preset)}
                  className={`min-h-[36px] px-3 py-1 rounded-xl font-mono-num text-xs font-semibold border transition-colors cursor-pointer ${
                    time === preset
                      ? 'bg-[#6D28D9] text-white border-[#6D28D9]'
                      : 'bg-purple-50/50 text-slate-700 border-purple-100 hover:bg-purple-100/70'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Status Konten */}
          <div>
            <span className="block text-sm font-bold text-slate-800 mb-2">
              Status Konten
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CONTENT_STATUSES.map((s) => {
                const sMeta = STATUS_META[s];
                const isSelected = status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex items-center justify-between gap-2 min-h-[48px] px-3.5 py-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? `${sMeta.bgClass} ${sMeta.borderClass} ring-1 ring-current`
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`p-1.5 rounded-xl ${sMeta.bgClass} ${sMeta.textClass}`}
                      >
                        <StatusIcon status={s} className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900 truncate">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: sMeta.dotColor }}
                          />
                          <span>{sMeta.label}</span>
                        </span>
                        <span className="block text-[11px] text-slate-500 truncate">
                          {sMeta.description}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#6D28D9] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="pt-2 pb-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[48px] px-4 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-[2] min-h-[48px] px-5 py-2.5 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-bold shadow-md shadow-purple-700/20 transition-colors cursor-pointer"
            >
              {editingItem ? 'Simpan Perubahan' : 'Simpan Jadwal Konten'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
