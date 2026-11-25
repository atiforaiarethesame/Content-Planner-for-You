import { ContentItem, CreatorSettings } from '../types/content';
import { toISODate } from '../utils/dateUtils';

export function getDefaultSettings(): CreatorSettings {
  return {
    creatorName: 'Creator',
    creatorNiche: 'Edukasi & Produktivitas',
    timezone: 'WIB',
    weekStartsOn: 'sunday',
    defaultTime: '19:00',
    remindersEnabled: true,
  };
}

function addDays(base: Date, offset: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + offset);
  return toISODate(d);
}

export function createSampleContent(todayDate: Date = new Date()): ContentItem[] {
  return [
    {
      id: 'cp-1',
      title: 'Konten Reels : Tip Kuliah Produktif',
      description:
        'Bagikan 3 teknik mencatat cepat (Cornell Notes) dan cara mengatur jadwal belajar agar tidak keteteran menjelang ujian.',
      platform: 'Instagram',
      date: addDays(todayDate, 1),
      time: '19:00',
      status: 'Siap Publikasi',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cp-2',
      title: 'Tutorial Edit Video CapCut untuk Pemula',
      description:
        'Video vertikal 45 detik membahas cara memotong klip cepat, tambah subtitle otomatis, dan memilih audio yang sedang tren.',
      platform: 'TikTok',
      date: addDays(todayDate, 2),
      time: '18:30',
      status: 'Sedang Diproses',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cp-3',
      title: 'Setup Meja Kerja Minimalis Budget Mahasiswa',
      description:
        'Review perlengkapan meja kerja di bawah 500 ribu lengkap dengan link produk dan tips pencahayaan untuk rekaman video.',
      platform: 'YouTube',
      date: addDays(todayDate, 3),
      time: '16:00',
      status: 'Terjadwal',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cp-4',
      title: 'Thread: 5 Kesalahan Creator Pemula Saat Konsisten Upload',
      description:
        'Bahas pentingnya batching konten mingguan, riset audiens, dan cara menghindari burnout saat membangun akun dari nol.',
      platform: 'X',
      date: addDays(todayDate, 0),
      time: '20:00',
      status: 'Siap Publikasi',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cp-5',
      title: 'Cara Membangun Personal Branding di Tahun Pertama Karier',
      description:
        'Tulisan reflektif tentang pentingnya mendokumentasikan proses belajar dan proyek portofolio secara konsisten.',
      platform: 'LinkedIn',
      date: addDays(todayDate, 5),
      time: '09:00',
      status: 'Terjadwal',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cp-6',
      title: 'Behind The Scenes: Proses Bikin Konten 1 Minggu Sekaligus',
      description:
        'Dokumentasi alur kerja dari riset ide di Senin pagi sampai jadwal tayang otomatis untuk 7 hari ke depan.',
      platform: 'Instagram',
      date: addDays(todayDate, -2),
      time: '19:00',
      status: 'Sudah Dipublikasikan',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cp-7',
      title: 'Q&A Komunitas: Rekomendasi Aplikasi Pendukung Creator',
      description:
        'Jawab pertanyaan pengikut seputar aplikasi kalender konten, pencatat ide, dan pengaturan jam tayang terbaik.',
      platform: 'Facebook',
      date: addDays(todayDate, -5),
      time: '12:00',
      status: 'Sudah Dipublikasikan',
      createdAt: new Date().toISOString(),
    },
  ];
}
