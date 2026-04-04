// File: frontend/src/theme.ts
// Deskripsi: Definisi Tema MUI standar referensi untuk warna & font (Roboto)

import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

// Memuat Font Roboto melalui Next.js (Lebih cepat & Best Practice)
const roboto = Roboto({
   weight: ['300', '400', '500', '700'],
   subsets: ['latin'],
   display: 'swap',
});

const theme = createTheme({
   palette: {
      // 1. Kustomisasi Warna sesuai Gambar Referensi
      primary: {
         // Warna tombol Biru Cerah (tiru gambar referensi)
         main: '#0a6cff',
         light: '#3e8bff',
         dark: '#004fcb',
      },
      text: {
         // Warna Teks Utama Dark Blue/Tua (tiru teks "with intuitive...")
         primary: '#1a237e',
         secondary: '#4d5c80',
      },
      background: {
         default: '#f8fafc',
      },
   },
   typography: {
      // 2. Mengaktifkan Font Roboto di seluruh aplikasi
      fontFamily: roboto.style.fontFamily,

      // Kustomisasi teks judul agar lebih estetik
      h4: {
         fontWeight: '700', // Sangat Bold seperti referensi "Move faster"
         color: '#1a237e', // Dark Blue
      },
      body1: {
         fontWeight: '500', // Medium
      }
   },
   components: {
      // 3. Kustomisasi Border Radius Global (Lebih Bulat)
      MuiButton: {
         styleOverrides: {
            root: {
               borderRadius: '30px', // Tombol membulat seperti pil (tiru gambar referensi)
               textTransform: 'none', // Mematikan huruf kapital semua agar modern
               fontSize: '1rem',
               padding: '12px 24px',
            }
         }
      },
      MuiTextField: {
         styleOverrides: {
            root: {
               // Input juga sedikit lebih bulat (jangan terlalu kotak)
               '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
               },
            }
         }
      }
   },
});

export default theme;