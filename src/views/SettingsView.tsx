import React, { useState, useEffect } from 'react';
import {
  User,
  Clock,
  Bell,
  Download,
  RotateCcw,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { CreatorSettings } from '../types/content';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface SettingsViewProps {
  settings: CreatorSettings;
  totalItemsCount: number;
  onUpdateSettings: (next: CreatorSettings) => void;
  onExportJSON: () => void;
  onResetSampleData: () => void;
  onClearAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  totalItemsCount,
  onUpdateSettings,
  onExportJSON,
  onResetSampleData,
  onClearAllData,
}) => {
  const [nameInput, setNameInput] = useState(settings.creatorName);
  const [nicheInput, setNicheInput] = useState(settings.creatorNiche);
  const [savedBanner, setSavedBanner] = useState(false);
  const [confirmMode, setConfirmMode] = useState<
    null | 'reset-sample' | 'clear-all'
  >(null);

  useEffect(() => {
    setNameInput(settings.creatorName);
    setNicheInput(settings.creatorNiche);
  }, [settings.creatorName, settings.creatorNiche]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      creatorName: nameInput.trim() || 'Creator',
      creatorNiche: nicheInput.trim() || 'Konten Kreatif',
    });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-950">Pengaturan</h1>
        <p className="text-sm text-slate-600 mt-0.5">
          Sesuaikan profil creator, zona waktu, dan kelola data jadwalmu.
        </p>
      </div>

      {savedBanner && (
        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Pengaturan profil berhasil disimpan!</span>
        </div>
      )}

      {/* Profile Form */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white rounded-3xl border border-purple-100 p-5 space-y-4"
      >
        <div className="flex items-center gap-2.5 pb-3 border-b border-purple-50">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6D28D9] flex items-center justify-center">
            <User className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">
              Profil Creator
            </h2>
            <p className="text-xs text-slate-500">
              Ditampilkan pada sapaan di halaman Beranda
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="creator-name"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Nama Panggilan
            </label>
            <input
              id="creator-name"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Contoh: Creator"
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-purple-50/30 text-sm text-slate-900 focus:bg-white focus:border-[#6D28D9] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="creator-niche"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Topik / Niche Utama
            </label>
            <input
              id="creator-niche"
              type="text"
              value={nicheInput}
              onChange={(e) => setNicheInput(e.target.value)}
              placeholder="Contoh: Edukasi & Produktivitas"
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-200 bg-purple-50/30 text-sm text-slate-900 focus:bg-white focus:border-[#6D28D9] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="min-h-[44px] px-5 py-2 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Simpan Profil
          </button>
        </div>
      </form>

      {/* Schedule Preferences */}
      <section className="bg-white rounded-3xl border border-purple-100 p-5 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-purple-50">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6D28D9] flex items-center justify-center">
            <Clock className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">
              Preferensi Jadwal & Kalender
            </h2>
            <p className="text-xs text-slate-500">
              Atur zona waktu dan awal minggu kalendermu
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="timezone-select"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Zona Waktu
            </label>
            <select
              id="timezone-select"
              value={settings.timezone}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  timezone: e.target.value as 'WIB' | 'WITA' | 'WIT',
                })
              }
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-purple-50/30 text-sm font-semibold text-slate-900 focus:border-[#6D28D9] focus:outline-none"
            >
              <option value="WIB">WIB (GMT+7)</option>
              <option value="WITA">WITA (GMT+8)</option>
              <option value="WIT">WIT (GMT+9)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="week-start-select"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Awal Minggu Kalender
            </label>
            <select
              id="week-start-select"
              value={settings.weekStartsOn}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  weekStartsOn: e.target.value as 'sunday' | 'monday',
                })
              }
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-purple-50/30 text-sm font-semibold text-slate-900 focus:border-[#6D28D9] focus:outline-none"
            >
              <option value="sunday">Minggu (Min - Sab)</option>
              <option value="monday">Senin (Sen - Min)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="default-time"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Jam Tayang Default
            </label>
            <input
              id="default-time"
              type="time"
              value={settings.defaultTime}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  defaultTime: e.target.value || '19:00',
                })
              }
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-purple-50/30 font-mono-num text-sm font-semibold text-slate-900 focus:border-[#6D28D9] focus:outline-none"
            />
          </div>
        </div>

        {/* Reminders Toggle */}
        <div className="pt-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bell className="w-4.5 h-4.5 text-slate-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-slate-900">
                Pengingat Jadwal Aktif
              </p>
              <p className="text-xs text-slate-500">
                Tampilkan lencana pengingat untuk konten 7 hari ke depan
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={settings.remindersEnabled}
            onClick={() =>
              onUpdateSettings({
                ...settings,
                remindersEnabled: !settings.remindersEnabled,
              })
            }
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
              settings.remindersEnabled ? 'bg-[#6D28D9]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                settings.remindersEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Data Management */}
      <section className="bg-white rounded-3xl border border-purple-100 p-5 space-y-3">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900">
            Kelola Data Jadwal ({totalItemsCount} konten tersimpan)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Semua jadwal tersimpan otomatis di perangkat ini.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onExportJSON}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-purple-100 hover:bg-purple-50 text-xs font-bold text-slate-800 inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#6D28D9]" />
            <span>Ekspor JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmMode('reset-sample')}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-purple-100 hover:bg-purple-50 text-xs font-bold text-slate-800 inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <span>Muat Data Contoh</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmMode('clear-all')}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 text-xs font-bold text-red-700 inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus Semua</span>
          </button>
        </div>
      </section>

      <ConfirmDialog
        isOpen={confirmMode === 'reset-sample'}
        title="Muat Ulang Data Contoh?"
        message="Daftar jadwal saat ini akan diganti dengan contoh konten pemula untuk mencoba fitur aplikasi."
        confirmLabel="Ya, Muat Contoh"
        onConfirm={() => {
          onResetSampleData();
          setConfirmMode(null);
        }}
        onCancel={() => setConfirmMode(null)}
      />

      <ConfirmDialog
        isOpen={confirmMode === 'clear-all'}
        title="Hapus Semua Jadwal?"
        message="Semua konten terjadwal akan dihapus permanen dari perangkat ini dan tidak bisa dikembalikan."
        confirmLabel="Hapus Semua"
        destructive
        onConfirm={() => {
          onClearAllData();
          setConfirmMode(null);
        }}
        onCancel={() => setConfirmMode(null)}
      />
    </div>
  );
};
