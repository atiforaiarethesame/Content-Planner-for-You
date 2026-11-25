import React, { useState, useMemo } from 'react';
import { Search, Plus, ArrowUpDown, FolderOpen } from 'lucide-react';
import {
  CONTENT_STATUSES,
  ContentItem,
  ContentStatus,
  CreatorSettings,
  PLATFORMS,
  Platform,
  STATUS_META,
} from '../types/content';
import { ContentCard } from '../components/ContentCard';

interface ContentListViewProps {
  items: ContentItem[];
  settings: CreatorSettings;
  todayStr: string;
  initialStatusFilter: ContentStatus | 'Semua';
  onStatusFilterChange: (status: ContentStatus | 'Semua') => void;
  onOpenCreate: () => void;
  onEditItem: (item: ContentItem) => void;
  onDuplicateItem: (item: ContentItem) => void;
  onDeleteItem: (item: ContentItem) => void;
  onStatusChange: (id: string, status: ContentStatus) => void;
}

export const ContentListView: React.FC<ContentListViewProps> = ({
  items,
  settings,
  todayStr,
  initialStatusFilter,
  onStatusFilterChange,
  onOpenCreate,
  onEditItem,
  onDuplicateItem,
  onDeleteItem,
  onStatusChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'Semua'>(
    'Semua'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items
      .filter((item) => {
        if (
          initialStatusFilter !== 'Semua' &&
          item.status !== initialStatusFilter
        ) {
          return false;
        }
        if (platformFilter !== 'Semua' && item.platform !== platformFilter) {
          return false;
        }
        if (q) {
          const inTitle = item.title.toLowerCase().includes(q);
          const inDesc = item.description.toLowerCase().includes(q);
          const inPlat = item.platform.toLowerCase().includes(q);
          return inTitle || inDesc || inPlat;
        }
        return true;
      })
      .sort((a, b) => {
        const keyA = `${a.date} ${a.time}`;
        const keyB = `${b.date} ${b.time}`;
        return sortOrder === 'asc'
          ? keyA.localeCompare(keyB)
          : keyB.localeCompare(keyA);
      });
  }, [items, initialStatusFilter, platformFilter, searchQuery, sortOrder]);

  return (
    <div className="space-y-5">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950">
            Daftar Konten
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Kelola semua konten terjadwal dan perbarui status produksinya.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-bold shadow-md shadow-purple-700/20 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Konten</span>
        </button>
      </div>

      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4.5 h-4.5 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul konten, catatan, atau platform..."
            className="w-full min-h-[46px] pl-11 pr-4 py-2.5 rounded-2xl border border-purple-100 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#6D28D9] focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() =>
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
          }
          className="min-h-[46px] px-4 py-2 rounded-2xl border border-purple-100 bg-white hover:bg-purple-50/50 text-xs font-bold text-slate-700 inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowUpDown className="w-4 h-4 text-[#6D28D9]" />
          <span>
            {sortOrder === 'asc' ? 'Jadwal Terdekat' : 'Jadwal Terjauh'}
          </span>
        </button>
      </div>

      {/* Interactive Color-Coded Status Filter Tabs */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => onStatusFilterChange('Semua')}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              initialStatusFilter === 'Semua'
                ? 'bg-[#6D28D9] text-white shadow-xs'
                : 'bg-white border border-purple-100 text-slate-600 hover:bg-purple-50'
            }`}
          >
            Semua Status
          </button>

          {CONTENT_STATUSES.map((status) => {
            const active = initialStatusFilter === status;
            const meta = STATUS_META[status];
            return (
              <button
                key={status}
                type="button"
                onClick={() => onStatusFilterChange(status)}
                className={`inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? meta.activeFilterClass
                    : 'bg-white border-purple-100 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: active ? '#FFFFFF' : meta.dotColor,
                  }}
                />
                <span>{status}</span>
              </button>
            );
          })}
        </div>

        {/* Platform Filter Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {(['Semua', ...PLATFORMS] as const).map((plat) => {
            const active = platformFilter === plat;
            return (
              <button
                key={plat}
                type="button"
                onClick={() => setPlatformFilter(plat)}
                className={`min-h-[36px] px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-purple-100 text-[#5B21B6] font-bold border border-purple-200'
                    : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-purple-50/40'
                }`}
              >
                {plat === 'Semua' ? 'Semua Platform' : plat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Count line */}
      <p className="text-xs font-medium text-slate-500">
        Menampilkan{' '}
        <strong className="text-slate-800">{filteredItems.length}</strong> dari{' '}
        {items.length} konten
      </p>

      {/* Content Cards List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-purple-100 p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-300 flex items-center justify-center mx-auto mb-3">
            <FolderOpen className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Tidak ada konten yang cocok
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Coba ubah filter status atau kata kunci pencarian, atau tambahkan
            rencana konten baru.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            {(initialStatusFilter !== 'Semua' ||
              platformFilter !== 'Semua' ||
              searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  onStatusFilterChange('Semua');
                  setPlatformFilter('Semua');
                  setSearchQuery('');
                }}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-purple-200 text-xs font-bold text-slate-700 hover:bg-purple-50 cursor-pointer"
              >
                Reset Filter
              </button>
            )}
            <button
              type="button"
              onClick={onOpenCreate}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#6D28D9] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Konten</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
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
  );
};
