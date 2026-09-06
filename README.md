# Senior Full Stack & System Design Guide

Web app pembelajaran berbahasa Indonesia untuk memperkuat pemahaman API, backend, frontend, reliability, dan system design pada level senior/principal.

## Fitur

- Materi dikelompokkan berdasarkan learning track.
- Pencarian mencakup judul, isi, best practices, pitfalls, dan practical rules.
- Konten berorientasi interview sekaligus production reasoning.
- Diagram arsitektur SVG lokal yang ringan dan tajam di mobile.
- Navigasi drawer dan layout mobile-first untuk long-form reading.
- Next-topic navigation dan estimasi waktu baca.

## Teknologi

- React 19
- Vite 7
- Lucide React
- CSS native

Project ini tidak memerlukan database atau backend. Seluruh materi saat ini disimpan sebagai data JavaScript dan aset SVG lokal.

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

## Backup ke GitHub

Folder ini sebaiknya dijadikan repository Git mandiri agar project lain dan data workspace tidak ikut terunggah:

```bash
cd /root/.openclaw/workspace/api-guide
git init
git add .
git commit -m "Initial backup of full stack and system design guide"
```

Setelah repository kosong dibuat di GitHub, hubungkan remote dan push sesuai instruksi GitHub. Jangan memasukkan credential, token, file `.env`, `node_modules/`, atau hasil build `dist/`.
