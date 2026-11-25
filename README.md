# Content Planner

Aplikasi mobile-first untuk membantu content creator mengatur jadwal publikasi konten media sosial secara mudah dan terencana.

## Fitur Utama

- **Dashboard Kalender**: Kalender bulanan dan mingguan interaktif untuk memantau dan memilih tanggal publikasi.
- **Tambah & Edit Konten**: Form lengkap untuk judul, deskripsi, pilihan platform (Instagram, TikTok, YouTube, X, LinkedIn, Facebook), tanggal, waktu publikasi (*prime time*), dan status konten.
- **Daftar Konten Terjadwal**: Pencarian, pengurutan, filter platform, dan filter 4 status konten dengan warna berbeda (*Terjadwal*, *Sedang Diproses*, *Siap Publikasi*, dan *Sudah Dipublikasikan*).
- **Analitik & Pengaturan**: Ringkasan kepadatan jadwal 7 hari, distribusi platform, preferensi zona waktu (`WIB`/`WITA`/`WIT`), serta ekspor data JSON.

## Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

## Sinkronisasi ke GitHub & Deploy ke Vercel

1. Inisialisasi dan push repository ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: content planner app"
   git branch -M main
   git remote add origin https://github.com/USERNAME/content-planner.git
   git push -u origin main
   ```
2. Buka [Vercel](https://vercel.com/), pilih **Add New Project**, lalu hubungkan repository GitHub tersebut.
3. Vercel akan otomatis mendeteksi preset **Vite** (`npm run build` dengan output `dist/` sesuai `vercel.json`). Klik **Deploy**.
