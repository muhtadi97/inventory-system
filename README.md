# INVENTORY MANAGER - Website Manajemen Stok Barang

Website lengkap untuk mengelola inventori barang dengan fitur CRUD, pencatatan barang masuk/keluar, statistik real-time, dan pagination yang bekerja dengan sempurna.

### 1. **PAGINATION**
- **Data yang ditampilkan sesuai per halaman**: Hanya menampilkan data sesuai halaman yang dipilih
- **Scrollbar untuk tabel**: Tabel memiliki scrollbar vertikal dan horizontal
- **Navigasi lengkap**: First, Previous, Numbered pages, Next, Last
- **Info halaman**: "Halaman 1 dari 3" dengan jumlah item yang tepat
- **Items per page**: Pilihan 10, 20, 30, 50 item per halaman

### 2. **DATA LENGKAP (25 ITEM)**
- 25 item contoh otomatis saat pertama kali
- Kategori: Elektronik, Peralatan Kantor, Alat Tulis
- Deskripsi detail setiap item
- Stok dan harga realistis

### 3. **RESPONSIF PENUH**
- **Desktop**: Tabel dengan scrollbar
- **Tablet**: Grid layout dengan tabel scrollable
- **Mobile**: Tampilan kartu dengan menu hamburger
- **Auto-switch view**: Berdasarkan ukuran layar

### 4. **SCROLLBAR OPTIMIZATION**
- **Tabel**: Scrollbar vertikal & horizontal
- **Log aktivitas**: Scrollbar vertikal
- **Modal**: Scrollbar vertikal
- **Custom styling**: Scrollbar yang sesuai dengan desain

## CARA MENGGUNAKAN

### Instalasi:
1. Buat folder `inventory-website`
2. Salin ketiga file ke dalam folder:
   - `index.html`
   - `style.css`
   - `script.js`
3. Buka `index.html` di browser web

### Penggunaan Dasar:
1. **Tambah Barang**: Klik "Tambah Barang Baru"
2. **Catat Stok**: Gunakan "Barang Masuk" atau "Barang Keluar"
3. **Edit/Hapus**: Klik ikon di kolom aksi
4. **Cari Barang**: Gunakan kotak pencarian
5. **Navigasi Halaman**: Gunakan tombol pagination di bawah tabel

### Untuk Mobile:
- Gunakan menu hamburger di header
- Tampilan otomatis berubah ke kartu
- Tombol aksi lebih besar untuk touch

## STRUKTUR DATA

### Data yang Disimpan:
1. **Inventori Barang** (localStorage)
   - ID, Nama, Kategori, Stok, Harga, Deskripsi
   - Stok Minimum, CreatedAt, UpdatedAt

2. **Aktivitas** (localStorage)
   - Jenis: add, edit, in, out, delete
   - Nama barang, Jumlah, Catatan, Timestamp

3. **Pagination Settings** (localStorage)
   - Items per page
   - Current view (table/cards)

## 🛠 TEKNOLOGI
- **HTML5, CSS3, JavaScript ES6**
- **Font Awesome 6.4.0** untuk ikon
- **Google Fonts (Poppins)** untuk typography
- **LocalStorage** untuk penyimpanan data
- **CSS Grid & Flexbox** untuk layout responsif
- **CSS Variables** untuk konsistensi warna


## CATATAN TEKNIS
- Data disimpan di browser (localStorage)
- Tidak perlu backend atau database
- Data tidak hilang saat refresh halaman
- Ekspor data ke CSV untuk backup
- Import data bisa dengan edit langsung di localStorage

## FITUR YANG SIAP DIGUNAKAN:
1. ✅ CRUD Lengkap untuk barang
2. ✅ Pencatatan stok masuk/keluar
3. ✅ Edit/hapus aktivitas
4. ✅ Pencarian real-time
5. ✅ Pagination dengan scrollbar
6. ✅ Responsif semua perangkat
7. ✅ Ekspor data ke CSV
8. ✅ Notifikasi operasi
9. ✅ Statistik real-time
10. ✅ Log aktivitas dengan timestamp

**Website siap digunakan untuk manajemen inventori skala kecil hingga menengah!**
