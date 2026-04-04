// File: frontend/src/components/ThemeRegistry.tsx
'use client';

import { createContext, useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
   weight: ['300', '400', '500', '700'],
   subsets: ['latin'],
   display: 'swap',
});

// 1. Membuat 'Context' (Sakelar Global) agar bisa diakses dari halaman mana saja
export const ColorModeContext = createContext({ toggleColorMode: () => { } });

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
   // 2. State untuk menyimpan pilihan mode (default: light)
   const [mode, setMode] = useState<'light' | 'dark'>('light');

   // 3. Fungsi untuk membalikkan state (Terang -> Gelap -> Terang)
   const colorMode = useMemo(
      () => ({
         toggleColorMode: () => {
            setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
         },
      }),
      [],
   );

   // 4. Membuat tema MUI dinamis berdasarkan state 'mode' saat ini
   const theme = useMemo(
      () =>
         createTheme({
            palette: {
               mode,
               // Definisi warna ganda: [Jika Terang] : [Jika Gelap]
               ...(mode === 'light'
                  ? {
                     primary: { main: '#007FFF' }, // Biru cerah
                     background: { default: '#f8fafc', paper: '#ffffff' }, // Putih
                     text: { primary: '#1A2027', secondary: '#3E5060' }, // Dark Blue
                  }
                  : {
                     primary: { main: '#3399FF' }, // Biru lebih neon untuk kontras gelap
                     background: { default: '#050C14', paper: '#0A1929' }, // Navy sangat gelap (MUI Dark)
                     text: { primary: '#ffffff', secondary: '#B2BAC2' }, // Putih keabu-abuan
                  }),
            },
            typography: { fontFamily: roboto.style.fontFamily },
            components: {
               MuiButton: { styleOverrides: { root: { borderRadius: '100px', textTransform: 'none' } } },
               MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: '12px' } } } },
            },
         }),
      [mode],
   );

   return (
      // Membungkus aplikasi dengan Context Sakelar
      <ColorModeContext.Provider value={colorMode}>
         <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
               <CssBaseline />
               {children}
            </ThemeProvider>
         </AppRouterCacheProvider>
      </ColorModeContext.Provider>
   );
}