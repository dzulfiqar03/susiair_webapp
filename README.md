# Susi Air Pilot App — Fullstack Developer Technical Test

Monorepo dengan dua folder:

| Folder | Stack |
|---|---|
| `/nest` | NestJS + TypeScript (REST API, data in-memory dari JSON) |
| `/nuxt` | Nuxt 3 (Composition API, `<script setup>`), Pinia, SCSS, TypeScript |

**Live demo:** Frontend `<ISI URL VERCEL/NETLIFY>` · Backend `<ISI URL RENDER/RAILWAY/FLY>`
**Akun tes:** `johndoe` / `susiairtest`

---

## Menjalankan secara lokal

Butuh Node.js >= 20.

### Backend
```bash
cd nest
cp .env.example .env
npm install
npm run start:dev        # development, http://localhost:3001
# atau produksi:
npm run build && npm run start:prod
```

| Variabel | Fungsi | Default |
|---|---|---|
| `PORT` | Port server | `3001` |
| `JWT_SECRET` | Secret penanda token | `dev-secret-change-me` (wajib diganti di produksi) |
| `APP_TODAY` | "Hari ini" untuk semua logika (tidak memakai `new Date()`) | `2026-05-15` |
| `CORS_ORIGIN` | Origin frontend yang diizinkan, pisahkan dengan koma | semua origin |

### Frontend
```bash
cd nuxt
cp .env.example .env
npm install
npm run dev              # http://localhost:3000
# atau produksi:
npm run build && node .output/server/index.mjs
```

| Variabel | Fungsi |
|---|---|
| `NUXT_PUBLIC_API_BASE` | URL backend, mis. `http://localhost:3001` |

---

## Endpoint

Semua endpoint wajib `Authorization: Bearer <token>` kecuali `/auth/login`.

| Method | Path | Keterangan |
|---|---|---|
| POST | `/auth/login` | `{ username, password }` → `{ accessToken }` |
| GET | `/pilot/me` | Nama, total jam terbang, avatar |
| GET | `/flight-hours?from=&to=` | Jam terbang harian (hari kosong = 0) |
| GET | `/flight-hours/summary?range=1w\|1m\|3m\|6m\|1y` | Rolling sum (15 titik: today ±7), 4 kartu limit, `limit` dan `yMax` |
| GET | `/documents` | Dokumen + `daysRemaining` + `status` (`safe`/`soon`/`expired`) |
| GET | `/schedules?year=&month=` | Jadwal satu bulan + legend |

Bentuk error seragam:
```json
{ "statusCode": 400, "error": "Bad Request", "message": ["..."], "path": "/...", "timestamp": "..." }
```

---

## Keputusan utama dan alasannya

1. **"Hari ini" dikonfigurasi (`APP_TODAY=2026-05-15`).** Brief melarang `new Date()` untuk "hari ini" agar hasil review konsisten. Semua perhitungan tanggal memakai UTC agar tidak terpengaruh timezone server.
2. **Rolling sum di server**, method `rollingWindowBluffing()` di `FlightHoursService`. Window `[tanggal − (N−1), tanggal]`; hari tanpa data berkontribusi `0` (tidak di-skip).
3. **Awal dataset (mulai 27 Des 2024):** bagian window yang jatuh sebelum data pertama dihitung `0` (partial window). Alternatif (mengisi dengan rata-rata) akan mengarang data yang tidak ada.
4. **Tanggal masa depan (> 15 Mei):** dataset berisi data sampai 31 Mei, jadi nilai itu dipakai apa adanya dan dianggap data terjadwal. Titik ditandai `isFuture` dan digambar dengan outline putus-putus di chart. Kartu limit tetap dihitung sampai "hari ini".
5. **Kartu limit** dihitung dengan window berakhir di today: harian 1 hari, mingguan 7, bulanan 30, tahunan 365. Warna indikator: hijau, kuning ≥ 80%, merah ≥ 100%.
6. **Total flight hours** memakai nilai `pilot.totalFlightHours` dari file data (1444,5 = jumlah seluruh dataset sampai 31 Mei, termasuk hari setelah today).
7. **Status dokumen dihitung di server** dengan today dari config. `mock-documents.json` berisi `"today": "2026-05-31"` yang bertentangan dengan brief (15 Mei), jadi field itu diabaikan. Hasil: Security Clearance *expired*; License (14 hari) dan Medical (27 hari) *soon*; Recurrent dan PPC *safe*.
8. **Chart di atas limit/yMax:** nilai di-clamp ke tepi atas area plot dan diberi penanda ▲, titik merah bila melewati limit. Tooltip (tap titik) tetap menampilkan nilai asli. Chart dibuat dengan SVG sendiri (tanpa library) agar ringan dan kontrolnya penuh.
9. **Badge hari di kalender:** tick bila `count_logbooks === count_schedules`, selain itu menampilkan **sisa duty** (`count_schedules − count_logbooks`), sesuai brief. (`fieldGuide` di JSON menyebut "total"; brief dijadikan acuan.)
10. **Kode duty memakai data API** (`DTY`, `RLV`, `TRD`, `TRX`, `ULV`, …) dan warna dari `base_color`, tidak di-hardcode di frontend. Kode di brief (DUTY, RL, TR, TX, UL) hanyalah penamaan berbeda untuk legend yang sama.
11. **Auth:** guard global (`APP_GUARD`) dengan decorator `@Public()` hanya untuk login; JWT 12 jam. Token disimpan di cookie (`useCookie`) agar route middleware dan SSR mengenali sesi. Respons 401 pada endpoint terproteksi otomatis mengarahkan ke `/login`.
12. **Validasi:** `class-validator` + `ValidationPipe` global (format tanggal, `from <= to`, enum range, `month` 1–12). `AllExceptionsFilter` global menyeragamkan error.

## Yang akan diubah jika ada waktu lebih
- Unit test untuk `rollingWindowBluffing()` dan e2e test endpoint; Playwright untuk alur login → home → schedule.
- Prefix-sum agar rolling sum O(1) per titik (saat ini O(window), cukup untuk 15 titik).
- Database (SQLite/Prisma), hashing password, refresh token, rate limit login, dan cookie `httpOnly` lewat BFF.
- Halaman detail jadwal, Logbook, dan More.
- Logo resmi Susi Air dari susiair.com (sementara memakai ikon pesawat), PWA/offline, dan dark mode.
- Catatan deploy: free tier Render dapat cold start (request pertama bisa lambat).
