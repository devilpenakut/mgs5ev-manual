# Laporan Audit UI/UX Teknis — MG S5 EV Indonesia

Tanggal audit: 24 September 2026  
Mode: read-only; tidak ada HTML/CSS yang diubah.  
Cakupan: 8/8 halaman HTML (`index.html`, `panduan.html`, `peringatan.html`, `tips.html`, `darurat.html`, `perawatan.html`, `masalah.html`, `kacafilm.html`) serta `style.css`, `search.css`, dan `masalah.css`.

Catatan metode: workflow `audit` dari skill Impeccable dijalankan sebagai pemeriksaan statis lengkap karena CLI lokal hanya menyediakan `detect`, bukan subcommand `audit`. Detector mekanis dijalankan terhadap semua target. Verifikasi browser desktop/mobile tidak dapat dilakukan karena browser in-app tidak tersedia; bukti responsive berasal dari inspeksi semua breakpoint dan aturan overflow. Temuan detector seperti “overused font”, “gradient text”, dan “em-dash overuse” diperlakukan sebagai sinyal kualitas, bukan blocker otomatis.

## Ringkasan eksekutif

### Skor kualitas per halaman

Skor /20 adalah penilaian ringkas gabungan aksesibilitas, performa, theming, responsive, dan integritas implementasi. Isu shared navigation/search memengaruhi semua halaman.

| Halaman | Skor | Ringkasannya |
|---|---:|---|
| `index.html` | 16/20 | Struktur utama baik; kontrol menu dan teks sekunder masih bermasalah. |
| `panduan.html` | 14/20 | Heading melompat, banyak inline style, tabel belum punya scope header. |
| `peringatan.html` | 15/20 | Konten mudah dipindai; item indikator belum memakai struktur heading/section semantik. |
| `tips.html` | 15/20 | Heading melompat ke `h3`; body card cenderung kecil. |
| `darurat.html` | 15/20 | Konten operasional cukup jelas; struktur kartu belum memakai heading semantik. |
| `perawatan.html` | 15/20 | Struktur section baik; teks kecil dan inline style tunggal mengurangi konsistensi. |
| `masalah.html` | 16/20 | Struktur section paling koheren; masih mewarisi isu nav/search dan copy komunitas. |
| `kacafilm.html` | 14/20 | Banyak tabel dan data; kepadatan, inline style, serta skala teks membuat auditability/scanability lebih lemah. |

**Skor kesehatan lintas situs: 14/20 — Good, address weak dimensions.**

| Dimensi | Skor | Temuan kunci |
|---|---:|---|
| Accessibility | 2/4 | Menu mobile bukan kontrol button native; dialog tidak punya focus trap/restore; beberapa warna gagal AA. |
| Performance | 3/4 | Situs lean dan statis; font eksternal render-blocking dan Pagefind memakai `noWorker: true`. |
| Theming | 3/4 | Token dark theme cukup konsisten, tetapi banyak warna/inline style langsung di markup. |
| Responsive Design | 3/4 | Ada viewport, grid fluid, breakpoint 768px, dan tabel horizontal; target sentuh desktop kecil. |
| Implementation Integrity | 3/4 | Sistem visual koheren dan product-specific; semantik kartu/heading belum seragam. |

### Status integritas implementasi

**Lulus dengan catatan.** Warna, radius, spacing inti, grid, dan komponen bersama menunjukkan sistem yang sengaja dibangun untuk manual MG S5 EV. Detector juga memverifikasi pola berulang: token CSS dipakai, tetapi gradient heading, inline style, dan teks kecil muncul di beberapa permukaan. Tidak ada indikasi layout yang perlu didesain ulang.

### Temuan prioritas

1. Perbaiki navigasi mobile menjadi kontrol keyboard-native dengan state yang diumumkan.
2. Kelola fokus dialog pencarian: fokus awal, Escape, fokus kembali ke pemicu, dan pembatasan fokus saat modal terbuka.
3. Naikkan kontras `#5c5c64` pada latar gelap; rasio terdeteksi sekitar 3,0:1 pada `#0a0a0c` dan 2,8:1 pada `#141417`, di bawah 4,5:1 untuk teks normal.
4. Rapikan hierarki heading `h1` → `h2` → `h3`, terutama di `panduan.html` dan `tips.html`.

## Temuan kritis

Tidak ditemukan P0 yang benar-benar memblokir pembacaan seluruh manual. Temuan P1 berikut tetap perlu diprioritaskan karena berdampak langsung pada pengguna keyboard/screen reader.

### [P1] Kontrol menu mobile tidak semantik dan menyembunyikan input fokusable

- **Lokasi:** semua 8 HTML, pola pada `index.html:46-49`, `panduan.html:46-49`, `peringatan.html:46-49`, `tips.html:46-49`, `darurat.html:46-49`, `perawatan.html:46-49`, `masalah.html:47-50`, `kacafilm.html:47-50`; aturan terkait `style.css:67-91,370-407`.
- **Kategori:** Accessibility / keyboard navigation.
- **Bukti:** Toggle dibuat sebagai `<input type="checkbox" aria-hidden="true">` yang dikendalikan `<label>`, bukan button. Elemen input tetap merupakan kontrol interaktif tetapi diberi `aria-hidden`; label tidak memiliki role/state `expanded`.
- **Dampak:** Pembaca layar dapat menerima state yang tidak konsisten; pengguna keyboard tidak mendapat nama/state kontrol yang andal. Label juga tidak memberi pola button yang eksplisit.
- **Standar:** WCAG 4.1.2 Name, Role, Value; WCAG 2.1.1 Keyboard.
- **Rekomendasi minimal:** Ganti pola dengan satu `<button aria-expanded aria-controls>` dan menu yang diberi id; pertahankan CSS/layout yang sama. Jika checkbox dipertahankan, hapus `aria-hidden`, tambahkan label/state yang benar, dan pastikan fokus terlihat.

### [P1] Dialog pencarian belum mengelola siklus fokus

- **Lokasi:** semua 8 HTML pada dialog, contoh `index.html:256-263`; `search.js:35-55`; `search.css:15-29`.
- **Kategori:** Accessibility / keyboard navigation.
- **Bukti:** Dialog memiliki `role="dialog"`, `aria-modal="true"`, label, dan close button, tetapi script hanya fokus ke input setelah membuka. Tidak ada focus trap dan tidak ada restore focus ke tombol pemicu saat ditutup.
- **Dampak:** Pengguna keyboard dapat keluar dari modal ke konten di belakangnya dan kehilangan konteks setelah close.
- **Standar:** WCAG 2.4.3 Focus Order; WAI-ARIA Dialog Pattern.
- **Rekomendasi minimal:** Simpan elemen pemicu terakhir, kembalikan fokus saat close, dan gunakan focus trap kecil berbasis JavaScript native; tidak perlu dependency baru.

### [P1] Teks sekunder gagal kontras WCAG AA

- **Lokasi:** `style.css:49` (`.muted-note`), `style.css:368` (`footer p`), dan teks turunan yang memakai `#5c5c64`; detector Impeccable melaporkan sekitar `3.0:1` pada `#0a0a0c` dan `2.8:1` pada `#141417`.
- **Kategori:** Accessibility / color.
- **Dampak:** Catatan kaki, catatan peringatan, dan teks sekunder sulit dibaca pada dark mode, terutama bagi pengguna low vision.
- **Standar:** WCAG 1.4.3 Contrast (Minimum), target 4,5:1 untuk teks normal.
- **Rekomendasi minimal:** Gunakan token `--muted` atau warna muted baru yang terverifikasi minimal 4,5:1. Jangan mengubah palet/komposisi; hanya naikkan luminance teks sekunder.

## Temuan sedang

### [P1] Heading melompat dari `h1` ke `h3`

- **Lokasi:** `panduan.html:69,91-188` dan `tips.html:69,81-95`.
- **Kategori:** Accessibility / semantics.
- **Bukti:** Setelah `h1`, kartu bab/tips langsung memakai `h3` tanpa `h2`.
- **Dampak:** Navigasi heading screen reader kehilangan level struktur; pengguna tidak dapat memahami relasi bagian secara konsisten.
- **Rekomendasi minimal:** Jadikan judul kelompok sebagai `h2`, atau turunkan judul kartu menjadi `h2` bila memang setiap kartu adalah bagian utama. Pertahankan ukuran visual melalui CSS yang sudah ada.

### [P1] Header tabel belum menyatakan cakupan kolom

- **Lokasi:** `index.html:145-151`, `panduan.html:241-242`, `perawatan.html:135-141`, dan seluruh 15 tabel pada `kacafilm.html:189-464`.
- **Kategori:** Accessibility / tables.
- **Bukti:** `<th>` ada, tetapi tidak ada `scope="col"`; tabel kaca film sangat lebar dan berulang.
- **Dampak:** Relasi header-data kurang eksplisit untuk screen reader, terutama pada tabel dengan banyak kolom.
- **Standar:** WCAG 1.3.1 Info and Relationships.
- **Rekomendasi minimal:** Tambahkan `scope="col"` pada header kolom. Tidak perlu mengubah layout tabel.

### [P2] Target sentuh desktop di bawah ukuran nyaman

- **Lokasi:** `style.css:108-116` untuk link navigasi (`padding:5px 11px`); `search.css:4-10` untuk tombol pencarian; `search.css:35-37` untuk close button.
- **Kategori:** Responsive / touch usability.
- **Dampak:** Area klik desktop sekitar 30–34px tinggi, di bawah rekomendasi 44px dan lebih mudah salah tekan.
- **Rekomendasi minimal:** Perbesar padding vertikal/area hit tanpa mengubah posisi atau visual hierarchy. Prioritaskan close/search dan link nav.

### [P2] Responsive cukup baik tetapi belum terverifikasi secara visual di browser

- **Lokasi:** `style.css:286` (`overflow-x:auto` untuk tabel), `style.css:328-335` (grid fluid), `style.css:370-407` (breakpoint 768px), `search.css:75-79`, `masalah.css:135-139`.
- **Kategori:** Responsive.
- **Bukti:** Ada viewport pada semua 8 halaman, grid memakai `auto-fit/auto-fill`, dan tabel diberi scroll horizontal. Browser in-app tidak tersedia, jadi overflow aktual dan perilaku menu pada viewport sempit belum dapat disintesis/diamati.
- **Dampak:** Risiko tersisa terutama pada tabel `kacafilm.html` dan nav yang padat; bukti kode menunjukkan mitigasi dasar sudah ada.
- **Rekomendasi minimal:** Verifikasi manual pada 320px, 375px, 768px, dan text zoom 200%; jangan menambah breakpoint sebelum ada kegagalan nyata.

### [P2] Alt text gambar ACC sudah ada; SVG indikator dekoratif belum diberi status eksplisit

- **Lokasi:** `panduan.html:213-223` memiliki alt text yang baik. SVG indikator inline pada `peringatan.html:78-91` tidak memiliki `aria-hidden="true"` atau accessible name.
- **Kategori:** Accessibility / alt text.
- **Dampak:** Jika SVG dibaca oleh assistive technology, pengguna bisa menerima noise grafis sebelum teks indikator yang sebenarnya.
- **Rekomendasi minimal:** Tandai SVG yang murni dekoratif sebagai `aria-hidden="true"`; pertahankan nama/arti pada `.lamp-name` dan `.lamp-desc`.

## Temuan minor

### [P2] Body/card text terlalu kecil pada beberapa konteks

- **Lokasi:** `style.css:185,192,194,209,261,266,287,289,314,320,324,326,330,337,357,368`; `masalah.css:7,71,105`; `search.css:33,55,72`.
- **Kategori:** Typography / readability.
- **Bukti:** Banyak teks berada pada 0,70–0,85rem; detector menandai sekitar 11,52px pada beberapa konteks.
- **Dampak:** Manual teknis dibaca lama di perangkat kecil; label uppercase dan data tabel menjadi cepat melelahkan.
- **Rekomendasi minimal:** Naikkan hanya body/catatan yang paling penting ke minimal 0,875rem atau gunakan `--muted` yang lebih kontras. Jangan membesarkan semua heading/kartu.

### [P2] Inline style menyulitkan konsistensi dan maintenance

- **Lokasi:** `panduan.html:213-277` (12 baris inline style), `perawatan.html:123`, `kacafilm.html:137-770` (banyak inline style untuk margin/border/grid).
- **Kategori:** Theming / implementation integrity.
- **Dampak:** Nilai spacing dan warna tersebar di markup; perubahan aksesibilitas warna harus dicari di banyak tempat.
- **Rekomendasi minimal:** Pada pass berikutnya, pindahkan hanya deklarasi yang berulang ke class yang sudah ada atau satu class kecil per pola. Jangan membuat design system baru.

### [P2] Warna hard-coded bercampur dengan token

- **Lokasi:** `style.css:6-12,149-152,173-174,294-308,368`; `masalah.css:81-118`; inline style di `panduan.html` dan `kacafilm.html`.
- **Kategori:** Theming / color.
- **Dampak:** Dark-mode quality dan contrast sulit dijaga ketika warna langsung ditulis ulang.
- **Rekomendasi minimal:** Prioritaskan teks, border, dan status yang dibaca pengguna; biarkan warna ikon dekoratif tetap hard-coded bila memang bagian dari identitas indikator.

### [P3] Gradient heading dan font Inter adalah sinyal kualitas, bukan blocker

- **Lokasi:** gradient pada `style.css:149-152`; font pada `style.css:5`; detector menandainya berulang di seluruh halaman karena stylesheet bersama.
- **Kategori:** Typography / visual quality.
- **Dampak:** Gradient tidak menyebabkan kegagalan fungsi, tetapi dapat menurunkan ketahanan kontras/printing. Inter cukup terbaca dan konsisten dengan desain saat ini.
- **Rekomendasi minimal:** Jangan ubah font atau identitas sekarang. Jika owner meminta quality pass khusus, verifikasi solid-color fallback untuk heading terlebih dahulu.

### [P3] Copy campuran istilah Indonesia–Inggris perlu glossary ringan

- **Lokasi:** contoh `tips.html:81-95`, `darurat.html:100-170`, `perawatan.html:84-123`, `masalah.html:91-120`, `kacafilm.html:548-770`.
- **Kategori:** UX copy / readability.
- **Dampak:** Istilah seperti “short-press”, “hard stop”, “Authorised Repairer”, “handling”, VLT, IR, dan TSER dapat membebani pemilik baru.
- **Rekomendasi minimal:** Pertahankan istilah teknis yang dibutuhkan, tetapi beri padanan Indonesia sekali pada kemunculan pertama atau glossary kecil. Jangan menulis ulang seluruh konten.

## Audit per halaman

| Halaman | Accessibility & semantics | Typography/color | Responsive/performance | Kesimpulan |
|---|---|---|---|---|
| `index.html` | Nav/search shared issue; tabel ada tanpa scope (`145-151`). | Hero gradient (`style.css:149-152`), footer/muted contrast. | Grid fluid, search hero, viewport tersedia; pagefind dimuat di akhir script. | Fondasi terbaik; fokus pada shared controls dan contrast. |
| `panduan.html` | `h1` → `h3` (`69,91-188`); 6 image alt baik; tabel tanpa scope (`241-242`). | 12 inline-style lines (`213-277`); detector menandai tiny text. | Tabel scroll; grid mobile satu kolom; ACC content padat. | Struktur semantik perlu dirapikan tanpa mengubah visual. |
| `peringatan.html` | Hanya `h1` (`69`); SVG indikator dekoratif belum hidden (`78-91`). | Indicator colors informatif; teks muted shared tetap gagal AA. | Lamp grid fluid; tidak ada tabel/gambar raster. | Mudah dipindai, tetapi ikon perlu dipastikan dekoratif. |
| `tips.html` | `h1` → `h3` (`69,81-95`); link eksternal berlabel. | Card body 0,8rem; detector menandai em-dash advisory. | Tips grid fluid, mobile collapse via auto-fit. | Perbaiki heading dan readability minor. |
| `darurat.html` | Banyak kartu/label div tanpa heading section semantik; shared nav/search. | Teks operasional kecil pada `.emer-grid`; status warna perlu tetap kontras. | Grid responsive; daftar langkah sudah ordered list pada area darurat. | Konten safety cukup operasional, struktur bisa diperkuat. |
| `perawatan.html` | Section heading baik (`80,131,167,232,287`); tabel tanpa scope (`135-141`). | Inline style `123`; body/data kecil. | Tabel scroll dan grid fluid. | Salah satu halaman terstruktur paling baik. |
| `masalah.html` | Heading section/card relatif koheren (`86-357`); shared nav/search. | `masalah.css` menambah label 0,68–0,7rem; severity colors perlu audit kontras. | Breakpoint khusus `masalah.css:135-139`; cards responsive. | Sistem issue-specific koheren, jangan diperluas berlebihan. |
| `kacafilm.html` | 15 tabel tanpa scope (`189-464`); banyak heading `h2/h3` sudah konsisten. | Banyak inline style dan tabel 0,82rem; copy teknis padat. | `.table-wrap` melindungi overflow; perlu verifikasi 320px/zoom. | Prioritas kedua setelah shared a11y karena volume data tinggi. |

## Rekomendasi fix per kategori

### Accessibility

1. Jadikan menu mobile button native dengan `aria-expanded` + `aria-controls`; pertahankan markup visual yang sama.
2. Tambahkan focus management pada modal pencarian: focus awal, Escape, restore focus, dan trap sederhana.
3. Naikkan warna `#5c5c64` ke token muted yang mencapai minimal 4,5:1.
4. Tambahkan `scope="col"` pada semua `<th>` dan `aria-hidden="true"` pada SVG indikator dekoratif.

### Semantics dan keyboard

1. Rapikan level heading `panduan.html` dan `tips.html`.
2. Gunakan heading untuk kelompok konten utama pada `peringatan.html` dan `darurat.html` bila section tersebut perlu dinavigasi; jangan menambah heading dekoratif.
3. Perbesar hit area nav/search/close secara vertikal tanpa memindahkan komponen.

### Color dan typography

1. Perbaiki hanya teks muted/footer/note yang gagal AA; jangan ubah palet hijau, surface, radius, atau layout.
2. Naikkan teks isi paling kecil secara selektif, terutama note, label data, dan deskripsi card.
3. Pertahankan Inter dan gradient hero kecuali ada mandat brand baru; keduanya bukan blocker.

### Responsive dan performance

1. Uji 8 halaman pada 320px, 375px, 768px, desktop, dan zoom 200% sebelum menambah CSS.
2. Pertahankan `overflow-x:auto` untuk tabel; jangan mengganti tabel dengan komponen baru.
3. Pertimbangkan `font-display: swap` untuk Google Fonts dan ukur dulu dampaknya.
4. Pertahankan aset ikon kecil; tidak ada bukti oversized asset pada halaman yang diaudit. Jangan menambah lazy-loading untuk enam ikon 36px sebelum ada kebutuhan nyata.

### Implementation integrity

1. Konsolidasikan inline style yang berulang hanya setelah perbaikan a11y selesai.
2. Re-run audit setelah perubahan dan pastikan tidak ada perubahan visual pada warna/font/layout.

## Hal yang sudah baik

- Semua halaman memiliki `lang="id"`, viewport, title, dan metadata dasar.
- Semua halaman memakai sistem visual bersama dan breakpoint mobile 768px.
- `:focus-visible` tersedia di `style.css:12`, dan tombol pencarian/close sudah memiliki accessible label.
- Tabel panjang dibungkus `.table-wrap` dengan horizontal overflow.
- Enam gambar ACC di `panduan.html:213-223` memiliki alt text deskriptif serta dimensi eksplisit.
- Link eksternal memakai `target="_blank" rel="noopener"`.
- Reduced-motion sudah dipertimbangkan di `style.css:409-412` dan `search.css:79`.

## Batasan dan langkah berikutnya

Audit ini tidak mengubah file lain. CLI Impeccable lokal tidak memiliki subcommand `audit`, sehingga laporan ini menggabungkan detector mekanis dan checklist `reference/audit.md`. Karena browser in-app tidak tersedia, tidak ada klaim bahwa gesture/tampilan pixel-level telah lulus pada perangkat nyata. Setelah perbaikan minimal dilakukan, jalankan kembali audit dan uji keyboard + viewport sempit pada semua 8 URL.
