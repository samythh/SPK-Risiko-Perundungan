// File: backend/src/routes/api.ts
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
    const semuaSiswa = await prisma.siswa.findMany({
      orderBy: { createdAt: 'desc' }
    });

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
router.post('/siswa', async (req: Request, res: Response): Promise<any> => {
  try {
    const { nis, nama, kelas } = req.body;

    if (!nis || !nama || !kelas) {
      return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi.' });
    }

    const cekNis = await prisma.siswa.findUnique({ where: { nis } });
    if (cekNis) {
      return res.status(400).json({ success: false, message: 'NIS sudah terdaftar di sistem.' });
    }

    const siswaBaru = await prisma.siswa.create({
      data: { nis, nama, kelas }
    });

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

// [POST] Menyimpan atau Memperbarui Bobot AHP Kriteria
router.post('/kriteria/bobot', async (req: Request, res: Response): Promise<any> => {
  try {
    const { weights } = req.body;

    if (!weights || !Array.isArray(weights)) {
      return res.status(400).json({ success: false, message: 'Format data bobot tidak valid.' });
    }

    const upsertPromises = weights.map((w: any) => {
      return prisma.kriteria.upsert({
        where: { kode: w.kode },
        // PERBAIKAN: updatedAt tidak perlu ditulis manual karena sudah ada @updatedAt di skema
        update: { bobot: w.bobot },
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

// ==========================================
// API ROUTES: PENILAIAN ALTERNATIF (SISWA) --> (YANG SEBELUMNYA HILANG)
// ==========================================

// [POST] Endpoint untuk menyimpan Bobot Lokal Siswa per Kriteria
router.post('/alternatif/bobot', async (req: Request, res: Response): Promise<any> => {
  try {
    const { kodeKriteria, penilaian } = req.body;

    // Validasi payload dari frontend
    if (!kodeKriteria || !penilaian || !Array.isArray(penilaian)) {
      return res.status(400).json({ success: false, message: 'Data yang dikirim tidak lengkap atau format salah.' });
    }

    // Menggunakan Prisma $transaction untuk operasi Upsert (Update/Insert) yang aman
    const upsertPromises = penilaian.map((p: any) => {
      return prisma.penilaianAlternatif.upsert({
        where: {
          // Kunci Ganda: Memastikan 1 siswa hanya punya 1 nilai per kriteria
          kodeKriteria_siswaId: {
            kodeKriteria: kodeKriteria,
            siswaId: p.siswaId
          }
        },
        update: {
          bobotLokal: p.bobotLokal
        },
        create: {
          kodeKriteria: kodeKriteria,
          siswaId: p.siswaId,
          bobotLokal: p.bobotLokal
        }
      });
    });

    await prisma.$transaction(upsertPromises);

    res.status(200).json({
      success: true,
      message: `Data penilaian untuk ${kodeKriteria} berhasil diamankan ke Database!`
    });

  } catch (error) {
    console.error("Error POST Penilaian Alternatif:", error);
    res.status(500).json({ success: false, message: 'Gagal menyimpan penilaian alternatif ke database.' });
  }
});

export default router;