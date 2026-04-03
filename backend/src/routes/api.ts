// File: backend/src/routes/api.ts
import { Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma'; // Mengimpor koneksi Prisma yang sudah kita buat

const router = Router();

// Endpoint /health ... (biarkan tetap ada)
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Server backend SPK berjalan!' });
});

// Endpoint Login yang terhubung dengan Database MySQL
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // 1. Prisma mencari user di database berdasarkan username yang diketik
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    // 2. Jika username tidak ditemukan di tabel MySQL
    if (!user) {
      res.status(401).json({ success: false, message: 'Username tidak terdaftar!' });
      return; // Menghentikan eksekusi kode ke bawah
    }

    // 3. Membandingkan password yang diketik dengan password acak (hash) di database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Jika cocok, login sukses
      res.status(200).json({ 
        success: true, 
        message: 'Login berhasil!', 
        user: { id: user.id, name: user.name, role: user.role } 
      });
    } else {
      // Jika salah sandi
      res.status(401).json({ success: false, message: 'Password Anda salah!' });
    }

  } catch (error) {
    console.error("Error saat proses login:", error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
});

export default router;