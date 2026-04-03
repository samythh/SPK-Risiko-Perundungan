// File: backend/prisma/seed.ts
// Deskripsi: Script untuk menyuntikkan data awal (akun Guru BK) ke dalam MySQL

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
   console.log('🌱 Memulai proses seeding database...');

   // 1. Membuat enkripsi password. Angka 10 adalah "garam" (tingkat kerumitan acak).
   const hashedPassword = await bcrypt.hash('rahasia123', 10);

   // 2. Menggunakan 'upsert' untuk memasukkan data. 
   // Jika username 'admin_bk' sudah ada, jangan lakukan apa-apa (update kosong).
   // Jika belum ada, buatkan data baru (create).
   const admin = await prisma.user.upsert({
      where: { username: 'admin_bk' },
      update: {},
      create: {
         username: 'admin_bk',
         password: hashedPassword,
         name: 'Bapak/Ibu Guru BK',
         role: 'GURU_BK',
      },
   });

   console.log(`✅ Akun berhasil dibuat dengan username: ${admin.username}`);
}

// Menjalankan fungsi utama dan menutup koneksi database setelah selesai
main()
   .catch((e) => {
      console.error('❌ Terjadi kesalahan saat seeding:', e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });