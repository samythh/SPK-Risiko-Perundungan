// File: src/routes/api.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ==========================================
// API ROUTES: MASTER DATA SISWA
// ==========================================

// 1. [GET] Endpoint untuk menarik seluruh daftar siswa
router.get('/siswa', async (req: Request, res: Response) => {
  try {
    // Meminta Prisma mengambil semua data dari tabel Siswa
    const semuaSiswa = await prisma.siswa.findMany({
      orderBy: { createdAt: 'desc' } // Mengurutkan dari data yang paling baru ditambahkan
    });

    // Mengembalikan data ke Frontend
    res.status(200).json({
      success: true,
      message: 'Data siswa berhasil ditarik',
      data: semuaSiswa
    });
  } catch (error) {
    console.error("Error GET Siswa:", error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
});

// 2. [POST] Endpoint untuk menyimpan siswa baru ke database MySQL
// Menggunakan tipe data 'any' pada Promise untuk memenuhi aturan ketat TypeScript pada Express
router.post('/siswa', async (req: Request, res: Response): Promise<any> => {
  try {
    // Menangkap payload JSON yang dikirim dari Frontend Next.js
    const { nis, nama, kelas } = req.body;

    // Validasi: Pastikan tidak ada data yang kosong
    if (!nis || !nama || !kelas) {
      return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi.' });
    }

    // Cek duplikasi: Pastikan NIS belum dipakai oleh siswa lain di database
    const cekNis = await prisma.siswa.findUnique({ where: { nis } });
    if (cekNis) {
      return res.status(400).json({ success: false, message: 'NIS sudah terdaftar di sistem.' });
    }

    // Eksekusi penyimpanan ke tabel database
    const siswaBaru = await prisma.siswa.create({
      data: { nis, nama, kelas }
    });

    // Mengirim jawaban sukses ke Frontend
    res.status(201).json({
      success: true,
      message: 'Siswa berhasil ditambahkan!',
      data: siswaBaru
    });
  } catch (error) {
    console.error("Error POST Siswa:", error);
    res.status(500).json({ success: false, message: 'Gagal menyimpan data ke database.' });
  }
});

// ==========================================
// API ROUTES: MASTER DATA KRITERIA & BOBOT
// ==========================================

// [POST] Menyimpan atau Memperbarui Bobot AHP
router.post('/kriteria/bobot', async (req: Request, res: Response): Promise<any> => {
  try {
    const { weights } = req.body; 
    // Format yang diharapkan: [{kode: 'C1', nama: '...', sifat: 'Cost', bobot: 0.45}, ...]

    if (!weights || !Array.isArray(weights)) {
      return res.status(400).json({ success: false, message: 'Format data bobot tidak valid.' });
    }

    // Menggunakan Prisma $transaction agar kelima kriteria disimpan secara bersamaan (Atomic)
    // Upsert = Update jika sudah ada, Insert (Create) jika belum ada
    const upsertPromises = weights.map((w: any) => {
      return prisma.kriteria.upsert({
        where: { kode: w.kode },
        update: { bobot: w.bobot, updatedAt: new Date() },
        create: { kode: w.kode, nama: w.nama, sifat: w.sifat, bobot: w.bobot }
      });
    });

    await prisma.$transaction(upsertPromises);

    res.status(200).json({ success: true, message: 'Bobot AHP berhasil disimpan ke Database!' });
  } catch (error) {
    console.error("Error POST Bobot Kriteria:", error);
    res.status(500).json({ success: false, message: 'Gagal menyimpan bobot ke database.' });
  }
});

export default router;