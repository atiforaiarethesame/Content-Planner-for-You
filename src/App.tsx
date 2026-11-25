import React, { useState, useEffect, useMemo } from 'react';
import {
  Home,
  FolderKanban,
  CalendarDays,
  BarChart3,
  Settings,
  Plus,
  Bell,
  Film,
} from 'lucide-react';
import {
  ContentItem,
  ContentStatus,
  CreatorSettings,
  NavTab,
} from './types/content';
import { createSampleContent, getDefaultSettings } from './data/initialData';
import { toISODate, parseISODate } from './utils/dateUtils';
import { HomeView } from './views/HomeView';
import { ContentListView } from './views/ContentListView';
import { CalendarView } from './views/CalendarView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';
import { ContentFormModal } from './components/ContentFormModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { NotificationDrawer } from './components/NotificationDrawer';

const STORAGE_ITEMS_KEY = 'content_planner_items_v1';
const STORAGE_SETTINGS_KEY = 'content_planner_settings_v1';

const NAV_ITEMS: Array<{
  id: NavTab;
  label: string;
  pageTitle: string;
  icon: React.FC<{ className?: string }>;
}> = [
  { id: 'beranda', label: 'Beranda', pageTitle: 'Beranda', icon: Home },
  {
    id: 'konten',
    label: 'Konten',
    pageTitle: 'Daftar Konten',
    icon: FolderKanban,
  },
  {
    id: 'kalender',
    label: 'Kalender',
    pageTitle: 'Kalender Konten',
    icon: CalendarDays,
  },
  { id: 'analitik', label: 'Analitik', pageTitle: 'Analitik', icon: BarChart3 },
  {
    id: 'pengaturan',
    label: 'Pengaturan',
    pageTitle: 'Pengaturan',
    icon: Settings,
  },
];

export default function App() {
  const todayDate = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => toISODate(todayDate), [todayDate]);

  const [items, setItems] = useState<ContentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ITEMS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback to sample data
    }
    return createSampleContent(new Date());
  });

  const [settings, setSettings] = useState<CreatorSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (saved) {
        return { ...getDefaultSettings(), ...JSON.parse(saved) };
      }
    } catch {
      // Fallback to default settings
    }
    return getDefaultSettings();
  });

  const [activeTab, setActiveTab] = useState<NavTab>('beranda');
  const [contentStatusFilter, setContentStatusFilter] = useState<
    ContentStatus | 'Semua'
  >('Semua');

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [calendarYear, setCalendarYear] = useState<number>(
    todayDate.getFullYear()
  );
  const [calendarMonth, setCalendarMonth] = useState<number>(
    todayDate.getMonth()
  );

  // Modal & Drawer states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [formInitialDate, setFormInitialDate] = useState<string>(todayStr);
  const [deletingItem, setDeletingItem] = useState<ContentItem | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage quota errors
    }
  }, [settings]);

  const switchTab = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  const upcoming7Days = useMemo(() => {
    const endDate = new Date(todayDate);
    endDate.setDate(endDate.getDate() + 7);
    const endStr = toISODate(endDate);

    return items
      .filter(
        (item) =>
          item.date >= todayStr &&
          item.date <= endStr &&
          item.status !== 'Sudah Dipublikasikan'
      )
      .sort((a, b) =>
        `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)
      );
  }, [items, todayStr, todayDate]);

  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    const d = parseISODate(dateStr);
    setCalendarYear(d.getFullYear());
    setCalendarMonth(d.getMonth());
  };

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarYear((y) => y - 1);
      setCalendarMonth(11);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarYear((y) => y + 1);
      setCalendarMonth(0);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const handleJumpToday = () => {
    setSelectedDate(todayStr);
    setCalendarYear(todayDate.getFullYear());
    setCalendarMonth(todayDate.getMonth());
  };

  const handleOpenCreate = (preselectedDate?: string) => {
    setEditingItem(null);
    setFormInitialDate(preselectedDate || selectedDate || todayStr);
    setIsFormOpen(true);
  };

  const handleEditItem = (item: ContentItem) => {
    setEditingItem(item);
    setFormInitialDate(item.date);
    setIsFormOpen(true);
  };

  const handleSaveContent = (
    data: Omit<ContentItem, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === existingId ? { ...item, ...data } : item
        )
      );
      showToast('Perubahan jadwal konten disimpan.');
    } else {
      const newItem: ContentItem = {
        ...data,
        id: `cp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      setItems((prev) => [newItem, ...prev]);
      handleSelectDate(data.date);
      showToast('Konten baru berhasil dijadwalkan.');
    }
  };

  const handleStatusChange = (id: string, nextStatus: ContentStatus) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item
      )
    );
    showToast(`Status diperbarui menjadi "${nextStatus}".`);
  };

  const handleDuplicateItem = (item: ContentItem) => {
    const copy: ContentItem = {
      ...item,
      id: `cp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: `${item.title} (Salinan)`,
      status: 'Terjadwal',
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => [copy, ...prev]);
    showToast('Konten berhasil diduplikasi.');
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    setItems((prev) => prev.filter((item) => item.id !== deletingItem.id));
    setDeletingItem(null);
    showToast('Konten dihapus dari jadwal.');
  };

  const handleExportJSON = () => {
    const payload = JSON.stringify({ settings, items }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-planner-${todayStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('File jadwal berhasil diekspor.');
  };

  const creatorInitial =
    settings.creatorName.trim().charAt(0).toUpperCase() || 'C';

  const currentNav = NAV_ITEMS.find((n) => n.id === activeTab);

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-900 flex flex-col lg:flex-row">
      {/* Desktop Left Sidebar Rail */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-purple-100 z-30">
        <div className="p-5 flex items-center gap-3 border-b border-purple-50">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] text-white flex items-center justify-center shadow-sm shrink-0">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <span className="block text-base font-extrabold text-[#4C1D95] tracking-tight truncate">
              Content Planner
            </span>
            <span className="block text-[11px] font-medium text-slate-500 truncate">
              Jadwal Media Sosial
            </span>
          </div>
        </div>

        <div className="p-4">
          <button
            type="button"
            onClick={() => handleOpenCreate(selectedDate)}
            className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#5B21B6] hover:to-[#6D28D9] text-white text-sm font-bold shadow-md shadow-purple-700/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Konten</span>
          </button>
        </div>

        <nav
          aria-label="Navigasi utama"
          className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto"
        >
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => switchTab(id)}
                className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-2xl flex items-center gap-3 text-sm font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#6D28D9] text-white shadow-sm shadow-purple-700/20'
                    : 'text-slate-600 hover:bg-purple-50 hover:text-[#5B21B6]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    active ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-purple-50">
          <button
            type="button"
            onClick={() => switchTab('pengaturan')}
            className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-purple-50 transition-colors text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] text-white font-bold text-sm flex items-center justify-center shrink-0">
              {creatorInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-slate-900 truncate">
                {settings.creatorName}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {settings.creatorNiche}
              </p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Compact Mobile & Desktop Top Bar */}
        <header className="sticky top-0 z-30 h-13 sm:h-14 bg-white/95 backdrop-blur-md border-b border-purple-100 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5 lg:hidden min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] text-white flex items-center justify-center shrink-0">
              <Film className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <span className="block text-sm font-extrabold text-[#4C1D95] tracking-tight truncate">
                {activeTab === 'beranda'
                  ? 'Content Planner'
                  : currentNav?.pageTitle || 'Content Planner'}
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-slate-900 font-bold">
              {currentNav?.pageTitle}
            </span>
            <span aria-hidden="true">·</span>
            <span>Zona Waktu {settings.timezone}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsNotificationOpen(true)}
              aria-label="Buka pengingat jadwal"
              className="relative min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[#6D28D9] hover:bg-purple-50 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {settings.remindersEnabled && upcoming7Days.length > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-500 text-white font-mono-num text-[10px] font-bold flex items-center justify-center">
                  {upcoming7Days.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => switchTab('pengaturan')}
              aria-label="Profil dan pengaturan"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full lg:hidden cursor-pointer"
            >
              <span className="w-8.5 h-8.5 rounded-full bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {creatorInitial}
              </span>
            </button>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-32 lg:pb-10">
          {activeTab === 'beranda' && (
            <HomeView
              items={items}
              settings={settings}
              todayStr={todayStr}
              selectedDate={selectedDate}
              calendarYear={calendarYear}
              calendarMonth={calendarMonth}
              onSelectDate={handleSelectDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onJumpToday={handleJumpToday}
              onOpenCreate={handleOpenCreate}
              onEditItem={handleEditItem}
              onDuplicateItem={handleDuplicateItem}
              onDeleteItem={(item) => setDeletingItem(item)}
              onStatusChange={handleStatusChange}
              onGoToContent={(statusFilter) => {
                setContentStatusFilter(statusFilter || 'Semua');
                switchTab('konten');
              }}
              onGoToCalendar={() => switchTab('kalender')}
            />
          )}

          {activeTab === 'konten' && (
            <ContentListView
              items={items}
              settings={settings}
              todayStr={todayStr}
              initialStatusFilter={contentStatusFilter}
              onStatusFilterChange={setContentStatusFilter}
              onOpenCreate={() => handleOpenCreate(selectedDate)}
              onEditItem={handleEditItem}
              onDuplicateItem={handleDuplicateItem}
              onDeleteItem={(item) => setDeletingItem(item)}
              onStatusChange={handleStatusChange}
            />
          )}

          {activeTab === 'kalender' && (
            <CalendarView
              items={items}
              settings={settings}
              todayStr={todayStr}
              selectedDate={selectedDate}
              calendarYear={calendarYear}
              calendarMonth={calendarMonth}
              onSelectDate={handleSelectDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onJumpToday={handleJumpToday}
              onOpenCreate={handleOpenCreate}
              onEditItem={handleEditItem}
              onDuplicateItem={handleDuplicateItem}
              onDeleteItem={(item) => setDeletingItem(item)}
              onStatusChange={handleStatusChange}
            />
          )}

          {activeTab === 'analitik' && (
            <AnalyticsView
              items={items}
              settings={settings}
              todayStr={todayStr}
              onOpenCreate={() => handleOpenCreate(selectedDate)}
              onGoToContent={(statusFilter) => {
                setContentStatusFilter(statusFilter || 'Semua');
                switchTab('konten');
              }}
            />
          )}

          {activeTab === 'pengaturan' && (
            <SettingsView
              settings={settings}
              totalItemsCount={items.length}
              onUpdateSettings={setSettings}
              onExportJSON={handleExportJSON}
              onResetSampleData={() => {
                setItems(createSampleContent(new Date()));
                showToast('Data contoh berhasil dimuat ulang.');
              }}
              onClearAllData={() => {
                setItems([]);
                showToast('Semua jadwal konten telah dihapus.');
              }}
            />
          )}
        </main>
      </div>

      {/* Highly Visible Labeled Mobile Floating Add Button */}
      <button
        type="button"
        onClick={() => handleOpenCreate(selectedDate)}
        aria-label="Tambah konten baru"
        className="lg:hidden fixed right-4 bottom-18 z-40 h-12 px-4 rounded-full bg-gradient-to-r from-[#5B21B6] to-[#7C3AED] hover:from-[#4C1D95] hover:to-[#6D28D9] active:scale-95 text-white shadow-lg shadow-purple-800/35 flex items-center gap-2 transition-transform cursor-pointer"
      >
        <Plus className="w-5 h-5 shrink-0" />
        <span className="text-xs font-extrabold whitespace-nowrap">
          Tambah Konten
        </span>
      </button>

      {/* Clean Mobile 5-Tab Bottom Navigation Bar */}
      <nav
        aria-label="Navigasi bawah mobile"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-purple-100 pb-safe"
      >
        <div className="grid grid-cols-5 items-center h-14 max-w-xl mx-auto">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => switchTab(id)}
                className="relative min-h-[48px] flex flex-col items-center justify-center gap-0.5 px-1 transition-colors cursor-pointer"
              >
                {active && (
                  <span className="absolute top-0 w-8 h-0.5 rounded-full bg-[#6D28D9]" />
                )}
                <span
                  className={`px-3 py-0.5 rounded-full transition-colors ${
                    active
                      ? 'bg-purple-100 text-[#6D28D9]'
                      : 'text-slate-400'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </span>
                <span
                  className={`text-[10px] tracking-tight whitespace-nowrap ${
                    active
                      ? 'font-extrabold text-[#5B21B6]'
                      : 'font-medium text-slate-500'
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Subtle Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-32 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#4C1D95] text-white text-xs font-semibold shadow-xl whitespace-nowrap"
        >
          {toastMessage}
        </div>
      )}

      {/* Add / Edit Modal */}
      <ContentFormModal
        isOpen={isFormOpen}
        editingItem={editingItem}
        initialDate={formInitialDate}
        defaultTime={settings.defaultTime}
        timezone={settings.timezone}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveContent}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingItem)}
        title="Hapus Konten Ini?"
        message={
          deletingItem
            ? `Konten "${deletingItem.title}" akan dihapus dari jadwalmu.`
            : ''
        }
        confirmLabel="Ya, Hapus"
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingItem(null)}
      />

      {/* Notification Reminders Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        upcomingItems={upcoming7Days}
        timezone={settings.timezone}
        todayStr={todayStr}
        onSelectContent={(item) => handleEditItem(item)}
        onGoToSchedule={() => {
          setContentStatusFilter('Semua');
          switchTab('konten');
        }}
      />
    </div>
  );
}
