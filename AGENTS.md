# AGENTS.md

Aturan global/default untuk AI atau coding agent yang bekerja pada project ini.

## Tujuan Project

Pertahankan project sebagai learning guide berbahasa Indonesia untuk senior full stack development dan system design interview. Materi harus praktis, akurat, mudah dibaca di mobile, dan memiliki bobot reasoning level senior/principal.

## Prinsip Kerja

- Baca `README.md`, `package.json`, dan file yang relevan sebelum mengubah code.
- Jangan mengubah scope atau arsitektur besar tanpa kebutuhan yang jelas.
- Pertahankan perilaku yang sudah berjalan dan hindari refactor besar bersamaan dengan penambahan materi.
- Jangan commit, push, membuat repository, atau melakukan deployment eksternal kecuali diminta.
- Jangan menambahkan credential, token, secret, atau data pribadi ke repository.
- Jangan menghapus perubahan yang tidak terkait milik pengguna.

## Bahasa dan Kualitas Konten

- Gunakan Bahasa Indonesia yang natural, jelas, dan ringkas.
- Pertahankan istilah teknis Bahasa Inggris bila terjemahannya berpotensi ambigu.
- Jangan hanya memberi definisi. Jelaskan:
  - problem yang diselesaikan;
  - kapan pendekatan digunakan;
  - trade-off;
  - failure mode;
  - implikasi operasional;
  - sinyal observability;
  - red flags saat interview.
- Hindari duplikasi. Audit materi yang ada sebelum membuat topik baru.
- Jika konsep baru beririsan dengan topik lama, perluas topik lama atau kelompokkan konsep dalam klaster yang koheren.

## Struktur Data Materi

Materi utama menggunakan field:

- `id`
- `title`
- `category`
- `section`
- `tag`
- `shortDesc`
- `detail`
- `springBoot`
- `comparison`
- `bestPractices`
- `pitfalls`
- `rule`
- `code`

Topik System Design Core dikelompokkan berdasarkan domain di `src/system-design-core/*.js`. `src/coreSystemDesignConcepts.js` hanya menjadi aggregator yang mempertahankan urutan ID. Mapping diagram berada di `src/coreSystemDesignDiagrams.js`.

Saat menambahkan topik:

1. Gunakan ID unik dan urutan yang konsisten.
2. Pastikan `section` cocok dengan learning track di `src/App.jsx`.
3. Isi seluruh field penting; jangan meninggalkan placeholder.
4. Pastikan search dapat menemukan istilah utama dan sinonim relevan.
5. Tempatkan materi pada file domain yang paling relevan dan pertahankan aggregator tetap tipis.

## UI/UX

- Mobile-first adalah requirement utama.
- Pengguna harus cepat mencapai isi materi; jangan menambahkan hero atau ringkasan besar sebelum artikel.
- Navigasi track/category cukup berada di sidebar atau drawer.
- Pertahankan touch target yang nyaman, typography terbaca, dan tanpa horizontal overflow.
- Jangan mengorbankan pengalaman desktop saat memperbaiki mobile.
- Gunakan komponen dan pola visual yang sudah ada sebelum membuat pola baru.

## Diagram

- Simpan diagram sebagai SVG lokal di `public/diagrams/`.
- Buat diagram orisinal; jangan menyalin gambar berhak cipta dari sumber eksternal.
- Gunakan label pendek, alur yang jelas, semantic colors, dan contrast yang terbaca.
- Prioritaskan 5–9 elemen utama agar diagram tetap nyaman di layar HP.
- Connector harus berada di belakang node dan memiliki arah yang jelas.
- Tambahkan `title`, `desc`, `role="img"`, dan caption berbahasa Indonesia.
- Jangan menambahkan link referensi visual ke UI kecuali diminta.

## Batas Struktur

- Jangan memasukkan generated output atau dependency ke Git:
  - `node_modules/`
  - `dist/`
  - logs
  - file environment/secrets
- Aset source yang dibutuhkan aplikasi, termasuk `public/diagrams/*.svg`, harus tetap masuk repository.
- Bila ukuran `App.jsx` menjadi penghambat nyata, lakukan ekstraksi bertahap berdasarkan domain; jangan melakukan rewrite sekaligus.

## Verifikasi Wajib

Setelah perubahan code atau konten:

```bash
npm run build
```

Untuk perubahan diagram, pastikan file SVG memiliki root `<svg>`, penutup `</svg>`, serta dapat dimuat dari route publik.

Untuk perubahan UI, cek:

- viewport mobile;
- sidebar/drawer;
- pencarian;
- pemilihan track/topik;
- next-topic navigation;
- code block dan diagram;
- tidak ada overflow horizontal.

Laporkan secara ringkas file yang diubah, hasil build, dan hal yang belum diverifikasi.
