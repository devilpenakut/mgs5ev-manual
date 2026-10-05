// Generates the warning-lamp section of site/peringatan.html from the data below.
// Source: MG S5 EV Owner Manual (mg.co.uk, 2025), "Warning Lamps and Indicators", pp. 54–64.
// Icons are drawn here (24×24, currentColor) after the manual's symbols, not copied from it.
// Usage: npm run lamps   (then npm run index to refresh search)
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

// Works in both repos: mgs5ev-pwa keeps the site in site/, mgs5ev-manual at the root
const ROOT = existsSync('site/peringatan.html') ? 'site/' : ''
const DARURAT = readFileSync(ROOT + 'darurat.html', 'utf8').includes('id="kecelakaan"') ? 'darurat.html#kecelakaan' : 'darurat.html'

// ---- Icons ----
const s = (d, extra = '') => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"${extra}/>`
const f = (d) => `<path d="${d}" fill="currentColor"/>`
const t = (x, y, size, text) => `<text x="${x}" y="${y}" font-size="${size}" font-weight="700" font-family="system-ui, sans-serif" text-anchor="middle" fill="currentColor">${text}</text>`
const bang = (x, y1, y2) => s(`M${x} ${y1}v${y2 - y1}`) + `<circle cx="${x}" cy="${y2 + 2.6}" r="1.1" fill="currentColor"/>`
const lampBody = s('M12 6c4.5 0 8 2.7 8 6s-3.5 6-8 6z')
const brackets = s('M4.5 5.5a9 9 0 0 0 0 13M19.5 5.5a9 9 0 0 1 0 13')
const car = (y = 0) => s(`M2.5 ${17 + y}v-3.2l2.8-.8 2.6-3.5h7.2l3.2 3.5 3.2.8v3.2z`) + s(`M5 ${17 + y}a2 2 0 0 0 4 0M15 ${17 + y}a2 2 0 0 0 4 0`)
const gauge = s('M4 16a8 8 0 0 1 14.5-4.6') + s('M11 15l4-4')
const wheel = s('M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16z') + s('M4.5 11.5h5l1.5 2h2l1.5-2h5M12 15.5V20')

const ICON = {
  dipped: lampBody + s('M3 8.5l6 1.5M3 12l6 1.5M3 15.5l6 1.5'),
  main: lampBody + s('M3 8.5h6M3 12h6M3 15.5h6'),
  smartbeam: lampBody + s('M3 8.5h6M3 12h6M3 15.5h6') + s('M13.6 15l1.9-6 1.9 6M14.2 13.2h2.6', ' stroke-width="1.4"'),
  side: s('M9.5 8.5a3.5 3.5 0 0 0 0 7zM14.5 8.5a3.5 3.5 0 0 1 0 7z') + s('M2.5 8l3.5 1.5M2.5 12h3.5M2.5 16l3.5-1.5M21.5 8L18 9.5M21.5 12H18M21.5 16L18 14.5'),
  rearfog: s('M10 6c-4.5 0-7 2.7-7 6s2.5 6 7 6z') + s('M14 8.5h7M14 12h7M14 15.5h7') + s('M17.5 6c-1.4 2 1.4 4 0 6s1.4 4 0 6'),
  turn: f('M2.5 12L10 4.8V9h11.5v6H10v4.2z'),
  airbag: `<circle cx="7.5" cy="4.5" r="2" fill="currentColor"/>` + s('M6.5 8.5L5 16h6.5l2 4.5M6 12.5h4.5') + `<circle cx="16.5" cy="10" r="4.5" fill="currentColor"/>`,
  seatbelt: `<circle cx="12" cy="4.5" r="2.2" fill="currentColor"/>` + s('M7.5 21v-7.5a4.5 4.5 0 0 1 9 0V21') + s('M8.5 9l7.5 9', ' stroke-width="2.4"'),
  antitheft: s('M2.5 17v-3.5L5 9h12l3 4.5h1.5V17z') + s('M9 13.5a1.8 1.8 0 1 0 0 .01M10.8 13.5h5M14.5 13.5v1.6'),
  tpms: s('M6.5 19.5C4.6 17.6 3.5 15 3.5 12s1.1-5.6 3-7.5M17.5 4.5c1.9 1.9 3 4.5 3 7.5s-1.1 5.6-3 7.5M5 19.5h14') + s('M7.5 19.5v1.5M10.5 19.5v1.5M13.5 19.5v1.5M16.5 19.5v1.5') + bang(12, 7, 13),
  eps: s('M10 5a7 7 0 1 0 0 14a7 7 0 1 0 0-14z') + s('M3.5 11.5h4.2l1.3 1.6h2l1.3-1.6h4.2M10 14.8V19') + bang(20.5, 6, 13),
  dsc: s('M5 10.5L7 6.5h10l2 4v3.5H5z') + `<circle cx="8" cy="14" r="1.2" fill="currentColor"/><circle cx="16" cy="14" r="1.2" fill="currentColor"/>` + s('M7.5 16.5c-2 1.4 1.5 2.6-.5 4.5M16.5 16.5c-2 1.4 1.5 2.6-.5 4.5'),
  dscoff: s('M5.5 8.5L7 5.5h10l1.5 3v2.5h-13z') + s('M8 13c-1.4 1 1 1.8-.4 3M16 13c-1.4 1 1 1.8-.4 3', ' stroke-width="1.4"') + t(12, 22.5, 6.5, 'OFF'),
  epb: brackets + s('M12 5.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 1 0 0-13z') + s('M10.2 15.5V8.7h2.4a1.9 1.9 0 0 1 0 3.8h-2.4'),
  epbfault: brackets + s('M12 5.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 1 0 0-13z') + s('M10.2 15.5V8.7h2.4a1.9 1.9 0 0 1 0 3.8h-2.4') + s('M3.5 19.5L20.5 6'),
  autohold: brackets + s('M12 5.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 1 0 0-13z') + s('M9.6 15.3L12 8.7l2.4 6.6M10.4 13.2h3.2'),
  hdc: s('M2.5 20.5L21.5 11') + s('M5 15.5l1-3.2 3-2.2 7-1.8 2.3 1.8.7 2.4-12.8 4.8z') + `<circle cx="8.5" cy="15" r="1.3" fill="currentColor"/><circle cx="16" cy="12.2" r="1.3" fill="currentColor"/>`,
  brake: brackets + s('M12 5.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 1 0 0-13z') + bang(12, 8.3, 12.6),
  abs: brackets + s('M12 5.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 1 0 0-13z') + t(12, 14.2, 5.2, 'ABS'),
  plug: s('M2.5 18c3.5 0 2.5-6 6.5-6h3') + s('M12 8.5h4.5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H12z') + s('M17.5 10h3.5M17.5 14h3.5'),
  battery12v: s('M3 7.5h18v11H3z') + s('M6 7.5V5.5h3v2M15 7.5V5.5h3v2') + s('M6 12.5h3M15 12.5h3M16.5 11v3'),
  motor: s('M5 9.5h12v7H5zM2.5 13H5M17 11h2.5v3.5H17M8.5 9.5v-2h5v2') + bang(11, 10.8, 12.8),
  ready: t(12, 15, 7, 'READY'),
  turtle: s('M3.5 15.5a7 6.5 0 0 1 14 0z') + s('M7 15.5l1.6-4.2h3.8l1.6 4.2') + s('M17.5 14.5h1.8a2 2 0 1 0-1.1-3.7') + s('M5.5 15.5v3M9 15.5v3M12 15.5v3M15.5 15.5v3'),
  hvbattery: s('M4 8.5h14v8H4z') + s('M7 8.5V7h2.5v1.5M12.5 8.5V7H15v1.5') + s('M6 18.5h14v-8') + s('M8 20.5h14v-8') + bang(11, 10.2, 12.2),
  powersys: car(1) + bang(12, 3.5, 7.5),
  charger: s('M5 20V5.5a1.5 1.5 0 0 1 1.5-1.5h6a1.5 1.5 0 0 1 1.5 1.5V20M3.5 20h12') + s('M7 7h5v3.5H7z') + s('M14 13h2.5a1.5 1.5 0 0 0 1.5-1.5V8M16.5 5.5v2.5h3V5.5M17.3 5.5V4M18.7 5.5V4'),
  sysmsg: s('M12 3.8L21.3 20H2.7z') + bang(12, 9.5, 14),
  cruise: gauge + t(12, 21.5, 6, 'SET'),
  acc: gauge + s('M12.5 20.5v-2l1.5-2.5h5.5l1.5 2.5v2z', ' stroke-width="1.5"'),
  speedlimit: gauge + t(12, 21.5, 6, 'LIM'),
  cruisefault: s('M4 18a8 8 0 0 1 13.5-5.8') + s('M10.5 17l3.5-3.5') + bang(20, 6, 12.5),
  limitsign: s('M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17z', ' stroke-width="2.4"') + t(12, 14.3, 6.5, '80'),
  ica: wheel,
  lka: s('M4 3.5v3M4 9.5v3M4 15.5v3M20 3.5v3M20 9.5v3M20 15.5v3') + s('M10 19l-.5-9 2.5-3 2.5 3-.5 9z'),
  fca: s('M1.5 18v-2.5l1.8-.5 1.7-2.5h4.5l2 2.5V18z') + s('M13 18v-2.5l2-2.5h4.5l1.7 2.5 1.3.5V18z') + s('M12 5v4M9 6.5l1.5 2.8M15 6.5l-1.5 2.8'),
}

// ---- Lamps (order inside a group = order in the manual) ----
// group: 'red' | 'yellow' | 'status'. states: [label, text]. tip: optional action/link (HTML).
const LAMPS = [
  // Red
  { id: 'airbag', icon: 'airbag', color: 'red', group: 'red', name: 'Airbag / SRS', en: 'Airbag Warning Lamp',
    states: [['Menyala', 'Ada gangguan pada sistem airbag (SRS) atau sabuk pengaman. Berhenti saat aman dan matikan daya. Airbag atau sabuk bisa tidak bekerja dengan benar saat terjadi tabrakan.']] },
  { id: 'sabuk', icon: 'seatbelt', color: 'red', group: 'red', name: 'Sabuk pengaman belum terpasang', en: 'Seat Belt Unfastened Warning Lamp',
    states: [['Menyala / berkedip', 'Ada kursi depan atau belakang yang terisi tetapi sabuknya belum dikencangkan.']] },
  { id: 'kunci', icon: 'antitheft', color: 'red', group: 'red', name: 'Kunci tidak terdeteksi', en: 'Anti-theft System Warning Lamp',
    states: [['Menyala', 'Kunci yang valid tidak terdeteksi. Gunakan kunci yang benar, atau letakkan smart key di posisi start cadangan.']],
    tip: '<a href="tips.html#start-cadangan">Cara start cadangan</a>' },
  { id: 'eps-merah', icon: 'eps', color: 'red', group: 'red', name: 'Power steering (EPS), merah', en: 'Electric Power Steering System (EPS) Warning Lamp',
    states: [['Menyala', 'Gangguan power steering terkait sudut kemudi. Mobil masih bisa dikendarai sebentar; segera ke bengkel resmi MG.'],
             ['Berkedip', 'Gangguan berat, setir terasa berat. Berhenti saat aman dan segera hubungi bengkel resmi MG.']] },
  { id: 'epb', icon: 'epb', color: 'red', group: 'red', name: 'Rem parkir elektronik (EPB)', en: 'Electronic Parking Brake (EPB) System Status Indicator Lamp',
    states: [['Menyala', 'Rem parkir aktif. Normal saat parkir.'],
             ['Berkedip', 'Mobil diparkir di tanjakan yang terlalu curam, atau sistem EPB gagal. Parkir di permukaan yang aman.']] },
  { id: 'rem', icon: 'brake', color: 'red', group: 'red', name: 'Sistem rem', en: 'Brake System Malfunction Indicator Lamp',
    states: [['Menyala', 'Ada gangguan pada sistem rem. Berhenti saat aman dan matikan daya.']] },
  { id: 'kabel-charger', icon: 'plug', color: 'red', group: 'red', name: 'Kabel charger terhubung', en: 'Charging Connection Indicator',
    states: [['Menyala', 'Kabel pengisian atau pengosongan daya sedang terpasang ke mobil.']] },
  { id: 'aki-12v', icon: 'battery12v', color: 'red', group: 'red', name: 'Aki 12V', en: 'Low-voltage Battery Charging System Malfunction Warning Lamp',
    states: [['Menyala', 'Setelah mobil dinyalakan: sistem pengisian aki 12V gagal.'],
             ['Berkedip', 'Aki 12V lemah dan muncul pesan di panel. Beberapa perangkat listrik dibatasi atau dimatikan. Segera nyalakan mobil agar aki 12V terisi.']] },
  { id: 'motor-merah', icon: 'motor', color: 'red', group: 'red', name: 'Motor penggerak, merah', en: 'Drive Motor Malfunction Indicator Lamp',
    states: [['Berkedip', 'Sistem motor gagal. Berhenti saat aman dan hubungi bengkel resmi MG.']] },
  { id: 'baterai-hv-merah', icon: 'hvbattery', color: 'red', group: 'red', name: 'Baterai tegangan tinggi, merah', en: 'Power Battery Malfunction Indicator Lamp',
    states: [['Menyala', 'Gangguan berat pada baterai. Berhenti saat aman, matikan daya, dan segera hubungi bengkel resmi MG.'],
             ['Berkedip', '<strong>Peringatan thermal runaway (baterai berisiko terbakar).</strong> Berhenti saat aman, matikan daya, <strong>segera tinggalkan mobil</strong>, lalu hubungi bengkel resmi MG.']],
    tip: `<a href="${DARURAT}">Prosedur darurat</a>` },
  { id: 'sistem-penggerak-merah', icon: 'powersys', color: 'red', group: 'red', name: 'Sistem penggerak, merah', en: 'Power System Malfunction Indicator Lamp',
    states: [['Menyala', 'Gangguan berat pada sistem penggerak. Berhenti saat aman dan matikan daya.']] },

  // Yellow
  { id: 'kabut-belakang', icon: 'rearfog', color: 'yellow', group: 'yellow', name: 'Lampu kabut belakang', en: 'Rear Fog Lamp Indicator',
    states: [['Menyala', 'Lampu kabut belakang sedang menyala.']] },
  { id: 'tpms', icon: 'tpms', color: 'yellow', group: 'yellow', name: 'Tekanan ban (TPMS)', en: 'Tyre Pressure Monitoring System (TPMS) Warning Lamp',
    states: [['Menyala', 'Tekanan ban rendah. Periksa tekanan semua ban.'],
             ['Berkedip lalu menyala', 'Sistem pemantau tekanan ban mendeteksi gangguan.']],
    tip: '<a href="tips.html#tekanan-ban-optimal">Tekanan ban yang disarankan</a>' },
  { id: 'eps-kuning', icon: 'eps', color: 'yellow', group: 'yellow', name: 'Power steering (EPS), kuning', en: 'Electric Power Steering System (EPS) Warning Lamp',
    states: [['Menyala', 'Gangguan umum, bantuan power steering berkurang. Mobil masih bisa dikendarai sebentar; segera ke bengkel resmi MG.']] },
  { id: 'dsc', icon: 'dsc', color: 'yellow', group: 'yellow', name: 'Kontrol stabilitas & traksi (DSC/TCS)', en: 'Dynamic Stability Control/Traction Control System Warning Lamp',
    states: [['Menyala', 'Sistem kontrol stabilitas atau traksi gagal.'],
             ['Berkedip', 'Normal: sistem sedang bekerja menjaga traksi dan stabilitas.']] },
  { id: 'dsc-off', icon: 'dscoff', color: 'yellow', group: 'yellow', name: 'DSC/TCS dimatikan', en: 'Dynamic Stability Control/Traction Control System OFF Warning Lamp',
    states: [['Menyala', 'Kontrol stabilitas dan traksi sedang dimatikan.']] },
  { id: 'epb-gangguan', icon: 'epbfault', color: 'yellow', group: 'yellow', name: 'Gangguan rem parkir (EPB)', en: 'Electronic Parking Brake (EPB) System Malfunction Indicator Lamp',
    states: [['Menyala', 'Sistem rem parkir elektronik mengalami gangguan.']] },
  { id: 'auto-hold-gangguan', icon: 'autohold', color: 'yellow', group: 'yellow', name: 'Gangguan Auto Hold', en: 'AUTO HOLD System Warning Lamp',
    states: [['Menyala', 'Fungsi Auto Hold gagal.']] },
  { id: 'hdc-gangguan', icon: 'hdc', color: 'yellow', group: 'yellow', name: 'Gangguan kontrol turunan (HDC)', en: 'Hill Descent Control (HDC) Malfunction Indicator Lamp',
    states: [['Menyala', 'Sistem kontrol turunan bukit (HDC) gagal.']] },
  { id: 'abs', icon: 'abs', color: 'yellow', group: 'yellow', name: 'ABS', en: 'ABS Malfunction Indicator Lamp',
    states: [['Menyala', 'ABS gagal. Rem biasa tetap berfungsi, tetapi tanpa ABS.']] },
  { id: 'motor-kuning', icon: 'motor', color: 'yellow', group: 'yellow', name: 'Motor penggerak, kuning', en: 'Drive Motor Malfunction Indicator Lamp',
    states: [['Menyala', 'Gangguan umum pada sistem motor.']] },
  { id: 'daya-dibatasi', icon: 'turtle', color: 'yellow', group: 'yellow', name: 'Daya penggerak dibatasi (kura-kura)', en: 'Drive Power Restricted Indicator',
    states: [['Menyala', 'Tenaga penggerak sedang dibatasi.']] },
  { id: 'baterai-hv-kuning', icon: 'hvbattery', color: 'yellow', group: 'yellow', name: 'Baterai tegangan tinggi, kuning', en: 'Power Battery Malfunction Indicator Lamp',
    states: [['Menyala', 'Ada gangguan pada sistem baterai. Hubungi bengkel resmi MG sesegera mungkin.']] },
  { id: 'sistem-penggerak-kuning', icon: 'powersys', color: 'yellow', group: 'yellow', name: 'Sistem penggerak, kuning', en: 'Power System Malfunction Indicator Lamp',
    states: [['Menyala', 'Gangguan umum pada sistem penggerak; fungsinya dibatasi.']] },
  { id: 'charging-gagal', icon: 'charger', color: 'yellow', group: 'yellow', name: 'Pengisian daya gagal', en: 'Charging/Discharging Status Indicator',
    states: [['Menyala', 'Pengisian atau pengosongan daya gagal.']] },
  { id: 'pesan-sistem', icon: 'sysmsg', color: 'yellow', group: 'yellow', name: 'Ada pesan peringatan', en: 'System Failure Message Indicator',
    states: [['Menyala', 'Ada pesan peringatan yang tersimpan. Buka pusat pesan (Message Centre) di panel instrumen untuk melihat isinya.']] },
  { id: 'cruise-gangguan', icon: 'cruisefault', color: 'yellow', group: 'yellow', name: 'Gangguan cruise / pembatas kecepatan', en: 'Cruise/Speed Limit System Malfunction Indicator Lamp',
    states: [['Menyala', 'Cruise control, adaptive cruise (ACC), atau pembatas kecepatan gagal.']] },
  { id: 'ica-gangguan', icon: 'ica', color: 'yellow', group: 'yellow', name: 'Gangguan Intelligent Cruise Assist', en: 'Intelligent Cruise Assist System Indicator',
    states: [['Menyala', 'Sistem Intelligent Cruise Assist (ICA) mengalami gangguan.']] },
  { id: 'lka-gangguan', icon: 'lka', color: 'yellow', group: 'yellow', name: 'Gangguan jaga lajur (LKA)', en: 'Lane Keeping Assist System Indicator',
    states: [['Menyala', 'Fungsi Lane Keeping Assist mendeteksi gangguan.']] },
  { id: 'fca', icon: 'fca', color: 'yellow', group: 'yellow', name: 'Peringatan tabrakan depan (FCA)', en: 'Forward Collision Assist System Indicator',
    states: [['Berkedip', 'Fungsi sedang bekerja (ada risiko tabrakan di depan).'],
             ['Menyala walau fungsi dimatikan', 'Sistem peringatan tabrakan depan mengalami gangguan.']] },

  // Status (green / blue / white)
  { id: 'lampu-dekat', icon: 'dipped', color: 'green', group: 'status', name: 'Lampu dekat', en: 'Dipped Beam Indicator', states: [['Menyala', 'Lampu depan jarak dekat menyala.']] },
  { id: 'lampu-jauh', icon: 'main', color: 'blue', group: 'status', name: 'Lampu jauh', en: 'Main Beam Indicator', states: [['Menyala', 'Lampu jauh menyala.']] },
  { id: 'smart-high-beam', icon: 'smartbeam', color: 'green', group: 'status', name: 'Smart high beam', en: 'Smart High Beam Indicator', states: [['Menyala', 'Lampu jauh otomatis aktif.']] },
  { id: 'lampu-senja', icon: 'side', color: 'green', group: 'status', name: 'Lampu senja (posisi)', en: 'Side Lamp Indicator', states: [['Menyala', 'Lampu posisi menyala.']] },
  { id: 'sein', icon: 'turn', color: 'green', group: 'status', name: 'Sein / hazard', en: 'Direction Indicator Lamp',
    states: [['Berkedip', 'Sein kiri atau kanan aktif. Keduanya berkedip bersamaan saat hazard menyala.'],
             ['Berkedip sangat cepat', 'Lampu sein di sisi itu rusak.']] },
  { id: 'auto-hold', icon: 'autohold', color: 'green', group: 'status', name: 'Auto Hold', en: 'AUTO HOLD System Warning Lamp', variants: ['white', 'green'],
    states: [['Putih', 'Auto Hold siaga.'], ['Hijau', 'Auto Hold sedang menahan mobil.']] },
  { id: 'hdc', icon: 'hdc', color: 'green', group: 'status', name: 'Kontrol turunan bukit (HDC)', en: 'Hill Descent Control (HDC) ON Indicator Lamp',
    states: [['Menyala', 'HDC siaga.'], ['Berkedip', 'HDC sedang mengendalikan laju mobil di turunan.']] },
  { id: 'ready', icon: 'ready', color: 'green', group: 'status', name: 'READY', en: 'READY Indicator', states: [['Menyala', 'Mobil siap dikendarai.']] },
  { id: 'charging', icon: 'charger', color: 'green', group: 'status', name: 'Pengisian / pengosongan daya', en: 'Charging/Discharging Status Indicator', variants: ['green', 'blue'],
    states: [['Hijau', 'Baterai sedang diisi.'], ['Biru', 'Daya sedang dikeluarkan dari mobil (discharging).']] },
  { id: 'cruise', icon: 'cruise', color: 'blue', group: 'status', name: 'Cruise control', en: 'Constant Speed Cruise Control System Indicator Lamp', variants: ['white', 'blue'],
    states: [['Putih', 'Siaga.'], ['Biru', 'Aktif.']] },
  { id: 'acc', icon: 'acc', color: 'blue', group: 'status', name: 'Adaptive cruise control (ACC)', en: 'Adaptive Cruise Control System Indicator', variants: ['white', 'blue'],
    states: [['Putih', 'Siaga.'], ['Biru', 'Aktif.']], tip: '<a href="panduan.html">Panduan ACC lengkap</a>' },
  { id: 'pembatas-kecepatan', icon: 'speedlimit', color: 'blue', group: 'status', name: 'Pembatas kecepatan', en: 'Speed Limit Assistance System Indicator', variants: ['white', 'blue'],
    states: [['Putih', 'Siaga.'], ['Biru', 'Aktif.'], ['Berkedip', 'Kecepatan melebihi batas yang diatur.']] },
  { id: 'rambu-batas', icon: 'limitsign', color: 'white', group: 'status', name: 'Rambu batas kecepatan', en: 'Speed Limit Sign Speed Indicator',
    states: [['Tampil', 'Batas kecepatan dari rambu yang terdeteksi.'], ['Berkedip', 'Kecepatan mobil melebihi batas tersebut.']] },
  { id: 'ica', icon: 'ica', color: 'blue', group: 'status', name: 'Intelligent Cruise Assist (ICA)', en: 'Intelligent Cruise Assist System Indicator', variants: ['white', 'blue'],
    states: [['Putih', 'Siaga.'], ['Biru', 'Aktif.']] },
  { id: 'lka', icon: 'lka', color: 'green', group: 'status', name: 'Jaga lajur (LKA)', en: 'Lane Keeping Assist System Indicator',
    states: [['Menyala', 'Lane Keeping Assist aktif.']] },
]

const GROUPS = [
  { key: 'red', id: 'merah', title: 'Merah: masalah serius atau keselamatan', lede: 'Kebanyakan berarti berhenti saat aman. Baca arti tiap lampu: beberapa lampu merah juga dipakai untuk status normal, misalnya rem parkir.' },
  { key: 'yellow', id: 'kuning', title: 'Kuning: ada gangguan, periksa segera', lede: 'Mobil umumnya masih bisa dikendarai dengan hati-hati. Periksa atau bawa ke bengkel resmi MG.' },
  { key: 'status', id: 'status', title: 'Hijau, biru, putih: status fitur', lede: 'Menunjukkan fitur yang sedang aktif atau siaga. Bukan tanda kerusakan.' },
]

// ---- Render ----
const esc = (x) => x.replace(/&(?![a-z#0-9]+;)/g, '&amp;')
const tile = (icon, color) => `<span class="lamp-tile c-${color}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[icon]}</svg></span>`

function renderLamp(l) {
  if (!ICON[l.icon]) throw new Error(`Missing icon ${l.icon}`)
  const tiles = (l.variants ?? [l.color]).map((c) => tile(l.icon, c)).join('')
  const states = l.states.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join('')
  return `      <article class="lamp is-${l.group}" id="${l.id}" aria-labelledby="${l.id}-t">
        <div class="lamp-tiles">${tiles}</div>
        <div class="lamp-body">
          <h3 id="${l.id}-t">${esc(l.name)}</h3>
          <p class="lamp-en" lang="en">${esc(l.en)}</p>
          <dl>${states}</dl>${l.tip ? `\n          <p class="lamp-tip">${l.tip} ›</p>` : ''}
        </div>
      </article>`
}

const total = LAMPS.length
const html = `<!-- lamps:start (generated by scripts/lamps.mjs, edit the data there) -->
  <div class="lamp-jump" role="navigation" aria-label="Lompat ke warna lampu">
${GROUPS.map((g) => `    <a href="#${g.id}" class="is-${g.key}">${g.title.split(':')[0]} <span>${LAMPS.filter((l) => l.group === g.key).length}</span></a>`).join('\n')}
  </div>
${GROUPS.map((g) => `  <section class="lamp-group" id="${g.id}" aria-labelledby="${g.id}-h">
    <h2 id="${g.id}-h">${g.title}</h2>
    <p>${g.lede}</p>
    <div class="lamp-list">
${LAMPS.filter((l) => l.group === g.key).map(renderLamp).join('\n')}
    </div>
  </section>`).join('\n')}
  <p class="lamp-source">Sumber: Buku Pemilik MG S5 EV, bab "Warning Lamps and Indicators". Tanda * di buku berarti hanya ada di varian tertentu. Jika ragu, hubungi bengkel resmi MG.</p>
  <!-- lamps:end -->`

const file = ROOT + 'peringatan.html'
let page = readFileSync(file, 'utf8')
const marked = /<!-- lamps:start[\s\S]*?<!-- lamps:end -->/
// First run: replace the old hand-written grid and note card
const legacy = /<div class="lamp-grid">[\s\S]*?<div class="card note-card">[\s\S]*?<\/div>/
if (marked.test(page)) page = page.replace(marked, html)
else if (legacy.test(page)) page = page.replace(legacy, html)
else throw new Error('No lamp section found in ' + file)
page = page.replace(/(<p class="hero-sub">)[^<]*(<\/p>)/, `$1${total} lampu peringatan dan indikator di panel MG S5 EV, dikelompokkan menurut warna.$2`)
writeFileSync(file, page)

const home = ROOT + 'index.html'
writeFileSync(home, readFileSync(home, 'utf8')
  .replace(/Arti \d+ lampu peringatan/, `Arti ${total} lampu peringatan`)
  .replace(/\d+ indikator dashboard/, `${total} lampu &amp; indikator`))

console.log(`✓ ${file}: ${total} lamps (${GROUPS.map((g) => `${g.key} ${LAMPS.filter((l) => l.group === g.key).length}`).join(', ')})`)
