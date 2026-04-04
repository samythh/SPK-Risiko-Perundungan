# 🛡️ Sistem Informasi Risiko Perundungan (SIRP) - AHP Method

Aplikasi Sistem Pendukung Keputusan (SPK) untuk membantu Guru BK mengidentifikasi risiko perundungan pada siswa menggunakan metode **Analytic Hierarchy Process (AHP)**.

---

## 👥 Tim Pengembang

* **Mikail Samyth Habibillah**
* **Ihsan Auliya Habiburrahim**
* **Duha Alul Bariq**
* **Sheva Ramadhan**

---

## 🛠️ Prasyarat (Prerequisites)

Sebelum menjalankan proyek, pastikan laptop Anda sudah terinstal:

* **Node.js** (Versi 18 atau terbaru)
* **XAMPP** (Untuk menjalankan layanan MySQL)
* **VS Code** (Editor kode utama)
* **Git** (Untuk kolaborasi repository)

---

## 📂 Struktur Folder

Proyek ini menggunakan arsitektur *decoupled* (terpisah):

* `/backend`: Express.js + Prisma ORM + MySQL.
* `/frontend`: Next.js + Material UI (MUI).

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

### 1. Setup Database (MySQL)

1. Nyalakan **Apache** dan **MySQL** di XAMPP Control Panel.
2. Buka [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
3. Buat database baru dengan nama: `db_spk_perundungan`.

### 2. Setup Backend (Express.js)

1. Buka terminal di dalam folder `backend`.
2. Instal semua library yang dibutuhkan:
   npm install
3. Buat file `.env` di dalam folder `backend` dan isi dengan konfigurasi berikut:
   DATABASE_URL="mysql://root:@localhost:3306/db_spk_perundungan"
   PORT=8000
4. Sinkronisasi skema database dengan Prisma:
   npx prisma db push
5. Tanamkan data akun admin Guru BK awal (Seeding):
   npx prisma db seed
6. Jalankan server backend:
   npm run dev
   *(Server Backend akan berjalan di: <http://localhost:8000>)*

### 3. Setup Frontend (Next.js)

1. Buka terminal baru (tab baru) di dalam folder `frontend`.
2. Instal semua library yang dibutuhkan:
   npm install
3. Jalankan server frontend:
   npm run dev
   *(Dashboard Frontend akan berjalan di: <http://localhost:3000>)*

---

## 🔑 Akun Login (Default)

Setelah aplikasi berjalan, gunakan kredensial berikut untuk masuk:

* **Username:** `admin_bk`
* **Password:** `rahasia123`

---

## 📚 Fitur Utama & Progress

* [x] **Autentikasi:** Login Guru BK dengan enkripsi Bcrypt.

* [x] **Database:** Integrasi MySQL via Prisma ORM.
* [x] **UI/UX:** Desain modern menggunakan Material UI (MUI).
* [ ] **Data Siswa:** Manajemen input data siswa (In Progress).
* [ ] **Kriteria AHP:** Input bobot dan perbandingan kriteria (In Progress).
* [ ] **Hasil Akhir:** Perangkingan risiko perundungan (Planned).

---

## ⚠️ Catatan Penting

Jika Anda melakukan perubahan pada file `prisma/schema.prisma`, jangan lupa untuk menjalankan perintah `npx prisma db push` kembali agar perubahan tersebut tersinkronisasi ke MySQL teman tim lainnya.# 🛡️ Sistem Informasi Risiko Perundungan (SIRP) - AHP Method

Aplikasi Sistem Pendukung Keputusan (SPK) untuk membantu Guru BK mengidentifikasi risiko perundungan pada siswa menggunakan metode **Analytic Hierarchy Process (AHP)**.

---

## 👥 Tim Pengembang

* **Mikail Samyth Habibillah** (Ketua / Frontend & UIUX)
* **Ihsan** (Backend & Database)
* **Duha** (Backend & Algorithm)

---

## 🛠️ Prasyarat (Prerequisites)

Sebelum menjalankan proyek, pastikan laptop Anda sudah terinstal:

* **Node.js** (Versi 18 atau terbaru)
* **XAMPP** (Untuk menjalankan layanan MySQL)
* **VS Code** (Editor kode utama)
* **Git** (Untuk kolaborasi repository)

---

## 📂 Struktur Folder

Proyek ini menggunakan arsitektur *decoupled* (terpisah):

* `/backend`: Express.js + Prisma ORM + MySQL.
* `/frontend`: Next.js + Material UI (MUI).

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

### 1. Setup Database (MySQL)

1. Nyalakan **Apache** dan **MySQL** di XAMPP Control Panel.
2. Buka [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
3. Buat database baru dengan nama: `db_spk_perundungan`.

### 2. Setup Backend (Express.js)

1. Buka terminal di dalam folder `backend`.
2. Instal semua library yang dibutuhkan:
   npm install
3. Buat file `.env` di dalam folder `backend` dan isi dengan konfigurasi berikut:
   DATABASE_URL="mysql://root:@localhost:3306/db_spk_perundungan"
   PORT=8000
4. Sinkronisasi skema database dengan Prisma:
   npx prisma db push
5. Tanamkan data akun admin Guru BK awal (Seeding):
   npx prisma db seed
6. Jalankan server backend:
   npm run dev
   *(Server Backend akan berjalan di: <http://localhost:8000>)*

### 3. Setup Frontend (Next.js)

1. Buka terminal baru (tab baru) di dalam folder `frontend`.
2. Instal semua library yang dibutuhkan:
   npm install
3. Jalankan server frontend:
   npm run dev
   *(Dashboard Frontend akan berjalan di: <http://localhost:3000>)*

---

## 🔑 Akun Login (Default)

Setelah aplikasi berjalan, gunakan kredensial berikut untuk masuk:

* **Username:** `admin_bk`
* **Password:** `rahasia123`

---

## 📚 Fitur Utama & Progress

* [x] **Autentikasi:** Login Guru BK dengan enkripsi Bcrypt.

* [x] **Database:** Integrasi MySQL via Prisma ORM.
* [x] **UI/UX:** Desain modern menggunakan Material UI (MUI).
* [ ] **Data Siswa:** Manajemen input data siswa (In Progress).
* [ ] **Kriteria AHP:** Input bobot dan perbandingan kriteria (In Progress).
* [ ] **Hasil Akhir:** Perangkingan risiko perundungan (Planned).

---

## ⚠️ Catatan Penting

Jika Anda melakukan perubahan pada file `prisma/schema.prisma`, jangan lupa untuk menjalankan perintah `npx prisma db push` kembali agar perubahan tersebut tersinkronisasi ke MySQL teman tim lainnya.
