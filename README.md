# Senior Full Stack & System Design Guide

Web app pembelajaran berbahasa Indonesia untuk memperkuat pemahaman API, backend, frontend, reliability, dan system design pada level senior/principal.

## Fitur

- Materi dikelompokkan berdasarkan learning track.
- Pencarian mencakup judul, isi, best practices, pitfalls, dan practical rules.
- Konten berorientasi interview sekaligus production reasoning.
- Diagram arsitektur SVG lokal yang ringan dan tajam di mobile.
- Navigasi drawer dan layout mobile-first untuk long-form reading.
- Next-topic navigation dan estimasi waktu baca.
- Kurikulum Java 21 dinamis yang membaca Markdown, source, dan test langsung dari folder materi lokal.
- Resume otomatis ke halaman terakhir melalui state JSON di server, dengan `localStorage` sebagai fallback browser.

## Teknologi

- React 19
- Vite 7
- Lucide React
- Marked + DOMPurify
- CSS native

Materi utama disimpan sebagai data JavaScript dan aset SVG lokal. Section Java menggunakan middleware read-only milik Vite untuk membaca sumber lokal secara on-demand; tidak memerlukan database dan tidak menyalin seluruh corpus ke initial bundle.

## Menjalankan Project

### Prasyarat

- Node.js 20.19+ atau 22.12+
- npm

### Development

```bash
npm install
npm run dev
```

Aplikasi tersedia di:

```text
http://localhost:1234
```

Jika aplikasi diakses melalui hostname publik saat menjalankan Vite, isi environment variable `API_GUIDE_ALLOWED_HOSTS` dengan daftar hostname yang dipisahkan koma.

Secara default, sumber section Java dibaca dari `/root/Claude-senior-java-engineer`. Lokasinya dapat diubah tanpa mengedit kode:

```bash
JAVA_GUIDE_SOURCE=/path/to/Claude-senior-java-engineer npm run dev
```

State halaman terakhir secara default disimpan di `$XDG_STATE_HOME/api-guide/reading-state.json` (fallback: `/root/.local/state/api-guide/reading-state.json`). Lokasinya dapat diubah dengan `API_GUIDE_READING_STATE_FILE`. File ini merupakan runtime state dan tidak perlu dimasukkan ke Git.

Implementasi ini memakai satu state global sederhana untuk penggunaan pribadi. Endpoint state tidak memiliki akun per pengguna; tambahkan autentikasi dan penyimpanan per-user sebelum aplikasi digunakan oleh banyak orang.

### Production build

```bash
npm ci
npm run build
```

Hasil build berada di folder `dist/`.

### Preview hasil build

```bash
npm run preview
```

Contoh konfigurasi hostname:

```bash
API_GUIDE_ALLOWED_HOSTS=your-domain.example npm run dev
```

## Struktur Project

```text
api-guide/
├── public/
│   └── diagrams/                    # Diagram arsitektur SVG
├── src/
│   ├── App.jsx                      # UI, navigasi, dan materi utama
│   ├── coreSystemDesignConcepts.js  # Aggregator materi System Design Core
│   ├── coreSystemDesignDiagrams.js  # Mapping materi ke diagram
│   ├── java/
│   │   └── JavaGuide.jsx             # UI dan state reader Java dinamis
│   ├── system-design-core/           # Materi core, dikelompokkan per domain
│   │   ├── deliveryAndRetrieval.js
│   │   ├── distributedData.js
│   │   ├── foundationsAndScale.js
│   │   ├── messagingAndRealtime.js
│   │   └── reliabilityAndOperations.js
│   ├── main.jsx                     # React entry point
│   └── styles.css                   # Seluruh styling aplikasi
├── AGENTS.md                        # Aturan kerja AI/coding agent
├── index.html
├── package.json
└── vite.config.js
```

`vite.config.js` membangun katalog Java otomatis dari folder bernomor `01-*` sampai `45-*` dan menyediakan endpoint read-only untuk file `.md` serta `.java`. Validasi real path mencegah akses ke file di luar sumber tersebut.

## Struktur Materi

Setiap topik mengikuti bentuk data berikut:

```js
{
  id: 'C01',
  title: 'Judul materi',
  category: 'SYSTEM DESIGN CORE',
  section: 'system-design-core',
  tag: 'data',
  shortDesc: 'Ringkasan singkat',
  detail: 'Core idea dan reasoning',
  springBoot: 'Implementasi praktis',
  comparison: 'Trade-off utama',
  bestPractices: 'Best practices level senior',
  pitfalls: 'Pitfalls dan red flags',
  rule: 'Aturan praktis',
  code: 'Diagram teks atau contoh implementasi'
}
```

Untuk menambahkan diagram:

1. Simpan SVG di `public/diagrams/`.
2. Tambahkan mapping di `src/coreSystemDesignDiagrams.js`.
3. Gunakan caption singkat yang menjelaskan keputusan arsitektur.

## Deployment Saat Ini

Instance live saat ini dijalankan oleh service:

```text
api-guide.service
```

Pemeriksaan dasar di server:

```bash
systemctl status api-guide.service
curl -I http://127.0.0.1:1234
```

Untuk deployment statis yang lebih sederhana, folder `dist/` juga dapat disajikan melalui NGINX, Cloudflare Pages, Netlify, atau layanan static hosting lain.

## Verifikasi Sebelum Merge

```bash
npm ci
npm run build
```

Kemudian cek minimal:

- navigasi desktop dan drawer mobile;
- pencarian materi;
- perpindahan antar-track dan next topic;
- diagram tampil tanpa horizontal overflow;
- halaman dapat dibaca nyaman pada viewport ponsel.

## Catatan Konten

- Bahasa utama adalah Bahasa Indonesia.
- Istilah teknis yang umum dipakai industri dapat tetap menggunakan Bahasa Inggris agar tidak ambigu.
- Materi harus menjelaskan alasan, trade-off, failure mode, dan implikasi operasional.
- Diagram dalam repository ini dibuat sebagai aset orisinal untuk project, bukan salinan langsung dari gambar referensi eksternal.

### Atribusi materi Java

Materi pada section Java diadaptasi dari [Claude Senior Java Engineer](https://github.com/msorkhpar/Claude-senior-java-engineer) oleh `msorkhpar`, yang tersedia berdasarkan lisensi [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/). Atribusi yang sama ditampilkan di dalam reader Java.

## Backup ke GitHub

Folder ini sebaiknya dijadikan repository Git mandiri agar project lain dan data workspace tidak ikut terunggah:

```bash
cd /root/.openclaw/workspace/api-guide
git init
git add .
git commit -m "Initial backup of full stack and system design guide"
```

Setelah repository kosong dibuat di GitHub, hubungkan remote dan push sesuai instruksi GitHub. Jangan memasukkan credential, token, file `.env`, `node_modules/`, atau hasil build `dist/`.
