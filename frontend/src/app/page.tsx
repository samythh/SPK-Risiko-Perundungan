// File: frontend/src/app/page.tsx
// Deskripsi: Halaman utama Next.js yang akan "menembak" API Express kita

'use client'; // Wajib ditambahkan agar kita bisa mengambil data langsung dari browser pengguna

import { useEffect, useState } from 'react';

export default function Home() {
  // State untuk menyimpan balasan dari backend
  const [message, setMessage] = useState<string>('Menunggu respon backend...');

  useEffect(() => {
    // Memanggil endpoint /api/health yang kita buat di Express sebelumnya
    fetch('http://localhost:8000/api/health')
      .then((res) => res.json())
      .then((data) => {
        // Jika berhasil, masukkan pesan dari backend ke dalam state
        setMessage(data.message);
      })
      .catch((error) => {
        // Jika gagal (misal server backend mati atau terkena CORS)
        setMessage('Gagal terhubung ke backend SPK!');
        console.error(error);
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50 text-slate-900">
      <h1 className="text-4xl font-bold mb-4">Dashboard SPK Perundungan</h1>
      
      {/* Kotak status koneksi */}
      <div className="p-4 rounded-lg bg-white shadow-md border border-slate-200">
        <p className="font-semibold text-lg">Status Koneksi API:</p>
        <p className={`${message.includes('berjalan') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      </div>
    </main>
  );
}