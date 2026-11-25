export type Platform =
  | 'Instagram'
  | 'TikTok'
  | 'YouTube'
  | 'X'
  | 'LinkedIn'
  | 'Facebook';

export type ContentStatus =
  | 'Terjadwal'
  | 'Sedang Diproses'
  | 'Siap Publikasi'
  | 'Sudah Dipublikasikan';

export type NavTab =
  | 'beranda'
  | 'konten'
  | 'kalender'
  | 'analitik'
  | 'pengaturan';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  platform: Platform;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: ContentStatus;
  createdAt: string;
}

export interface CreatorSettings {
  creatorName: string;
  creatorNiche: string;
  timezone: 'WIB' | 'WITA' | 'WIT';
  weekStartsOn: 'sunday' | 'monday';
  defaultTime: string;
  remindersEnabled: boolean;
}

export const PLATFORMS: Platform[] = [
  'Instagram',
  'TikTok',
  'YouTube',
  'X',
  'LinkedIn',
  'Facebook',
];

export const CONTENT_STATUSES: ContentStatus[] = [
  'Terjadwal',
  'Sedang Diproses',
  'Siap Publikasi',
  'Sudah Dipublikasikan',
];

export const PLATFORM_META: Record<
  Platform,
  {
    label: string;
    shortLabel: string;
    accentColor: string;
    bgTint: string;
    textTint: string;
    formatHint: string;
  }
> = {
  Instagram: {
    label: 'Instagram',
    shortLabel: 'IG',
    accentColor: '#E1306C',
    bgTint: 'bg-rose-50',
    textTint: 'text-rose-700',
    formatHint: 'Reels, Carousel, atau Story',
  },
  TikTok: {
    label: 'TikTok',
    shortLabel: 'TT',
    accentColor: '#0F172A',
    bgTint: 'bg-slate-100',
    textTint: 'text-slate-800',
    formatHint: 'Video Pendek 15-60 detik',
  },
  YouTube: {
    label: 'YouTube',
    shortLabel: 'YT',
    accentColor: '#DC2626',
    bgTint: 'bg-red-50',
    textTint: 'text-red-700',
    formatHint: 'Video Panjang atau Shorts',
  },
  X: {
    label: 'X / Twitter',
    shortLabel: 'X',
    accentColor: '#1E293B',
    bgTint: 'bg-slate-100',
    textTint: 'text-slate-900',
    formatHint: 'Thread atau Cuitan Singkat',
  },
  LinkedIn: {
    label: 'LinkedIn',
    shortLabel: 'IN',
    accentColor: '#0A66C2',
    bgTint: 'bg-sky-50',
    textTint: 'text-sky-700',
    formatHint: 'Artikel atau Insight Karier',
  },
  Facebook: {
    label: 'Facebook',
    shortLabel: 'FB',
    accentColor: '#1877F2',
    bgTint: 'bg-blue-50',
    textTint: 'text-blue-700',
    formatHint: 'Postingan Komunitas atau Video',
  },
};

export const STATUS_META: Record<
  ContentStatus,
  {
    label: string;
    description: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    activeFilterClass: string;
    dotColor: string;
  }
> = {
  Terjadwal: {
    label: 'Terjadwal',
    description: 'Sudah masuk rencana kalender',
    bgClass: 'bg-sky-50',
    textClass: 'text-sky-800',
    borderClass: 'border-sky-200',
    activeFilterClass: 'bg-sky-600 text-white border-sky-600',
    dotColor: '#0284C7',
  },
  'Sedang Diproses': {
    label: 'Sedang Diproses',
    description: 'Masih tahap editing atau penulisan',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-800',
    borderClass: 'border-amber-200',
    activeFilterClass: 'bg-amber-500 text-white border-amber-500',
    dotColor: '#D97706',
  },
  'Siap Publikasi': {
    label: 'Siap Publikasi',
    description: 'Materi final siap diunggah',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-800',
    borderClass: 'border-emerald-200',
    activeFilterClass: 'bg-emerald-600 text-white border-emerald-600',
    dotColor: '#059669',
  },
  'Sudah Dipublikasikan': {
    label: 'Sudah Dipublikasikan',
    description: 'Sudah tayang di media sosial',
    bgClass: 'bg-purple-100',
    textClass: 'text-purple-800',
    borderClass: 'border-purple-200',
    activeFilterClass: 'bg-[#6D28D9] text-white border-[#6D28D9]',
    dotColor: '#7C3AED',
  },
};
