# INVENTORY MANAGER - Website Manajemen Stok Barang

Website lengkap untuk mengelola inventori barang dengan fitur CRUD, pencatatan barang masuk/keluar, dan statistik real-time.

## FITUR UTAMA

### 1. **Manajemen Barang Lengkap (CRUD)**
- Tambah barang baru dengan detail lengkap
- Edit informasi barang yang sudah ada
- Hapus barang dari inventori
- Pencarian barang cepat

### 2. **Pencatatan Stok**
- Catat barang masuk (restock/pembelian)
- Catat barang keluar (penjualan/penggunaan)
- Edit dan hapus transaksi stok
- Dropdown pilih barang yang sudah ada

### 3. **Dashboard & Statistik**
- Ringkasan total barang
- Monitoring stok rendah
- Total barang masuk/keluar
- Aktivitas terbaru dengan timestamp

### 4. **Responsif & Mobile-Friendly**
- Tampilan tabel untuk desktop
- Tampilan kartu untuk mobile
- Menu khusus untuk perangkat mobile
- Responsif di semua ukuran layar

### 5. **Pagination Lengkap**
- 25 item contoh otomatis
- Pagination dengan 20 item per halaman default
- Navigasi: First, Previous, Numbered, Next, Last
- Pilihan jumlah item per halaman (10, 20, 30, 50)

### 6. **Fitur Tambahan**
- Ekspor data ke format CSV
- Pencarian real-time
- Notifikasi operasi berhasil
- Penyimpanan data di localStorage

## CARA MENGGUNAKAN

### Instalasi:
1. Buat folder `inventory-website`
2. Salin ketiga file ke dalam folder:
   - `index.html`
   - `style.css`
   - `script.js`
3. Buka `index.html` di browser web

### Penggunaan Dasar:
1. **Tambah Barang:** Klik "Tambah Barang Baru"
2. **Catat Stok:** Gunakan "Barang Masuk" atau "Barang Keluar"
3. **Edit/Hapus:** Klik ikon di kolom aksi
4. **Cari Barang:** Gunakan kotak pencarian
5. **Navigasi Halaman:** Gunakan tombol pagination di bawah tabel

### Untuk Mobile:
- Gunakan menu hamburger di header
- Tampilan otomatis berubah ke kartu
- Tombol aksi lebih besar untuk touch

## TEKNOLOGI
- HTML5, CSS3, JavaScript ES6
- Font Awesome untuk ikon
- Google Fonts (Poppins)
- LocalStorage untuk penyimpanan
- CSS Grid & Flexbox untuk layout

## DATA CONTOH
Website dilengkapi dengan **25 item contoh** otomatis:
- **Elektronik:** Laptop, Mouse, Printer, Monitor, dll
- **Peralatan Kantor:** Kertas, Stapler, Binder Clip, dll
- **Alat Tulis:** Bolpoin, Highlighter, Notebook, dll

## CATATAN
- Data disimpan di browser (localStorage)
- Tidak perlu backend atau database
- Data tidak hilang saat refresh halaman
- Kompatibel dengan semua browser modern
