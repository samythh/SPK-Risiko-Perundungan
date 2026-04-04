// File: frontend/src/app/login/page.tsx
'use client';

import { useState, useContext } from 'react'; // Tambah useContext
import { useRouter } from 'next/navigation';
import {
   Box, Button, TextField, Typography, Alert, Paper,
   Grow, IconButton, InputAdornment, useTheme
} from '@mui/material';
import {
   Visibility, VisibilityOff, ArrowForward, LightMode, DarkMode
} from '@mui/icons-material';

// Mengimpor sakelar pusat dari ThemeRegistry
import { ColorModeContext } from '@/components/ThemeRegistry';

export default function LoginPage() {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [status, setStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null);
   const [showPassword, setShowPassword] = useState(false);

   const router = useRouter();

   // Mengambil informasi tema saat ini dan fungsi sakelarnya
   const theme = useTheme();
   const colorMode = useContext(ColorModeContext);

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus(null);
      try {
         const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
         });
         const data = await response.json();
         if (response.ok) {
            setStatus({ type: 'success', message: data.message });
            setTimeout(() => { router.push('/dashboard'); }, 1000);
         } else {
            setStatus({ type: 'error', message: data.message });
         }
      } catch (error) {
         console.error("Detail kegagalan sistem:", error);
         setStatus({ type: 'error', message: 'Gagal terhubung ke server backend.' });
      }
   };

   const animatedElement = (element: React.ReactNode, index: number) => (
      <Grow in={true} timeout={800} style={{ transformOrigin: 'top center', transitionDelay: `${index * 150}ms` }}>
         <Box sx={{ width: '100%' }}>{element}</Box>
      </Grow>
   );

   return (
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>

         {/* SISI KIRI: Gambar Visual */}
         <Box
            sx={{
               flex: 3,
               backgroundImage: 'url(/login-bg.jpg)',
               backgroundRepeat: 'no-repeat',
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               position: 'relative',
            }}
         >
            <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.15)' }} />
         </Box>

         {/* SISI KANAN: Form Login */}
         <Box
            component={Paper}
            elevation={0}
            square
            sx={{
               flex: 1,
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'center',
               px: 6,
               minWidth: 400,
               borderLeft: '1px solid',
               borderColor: 'divider', // Otomatis menyesuaikan garis pembatas dengan mode gelap/terang
               position: 'relative', // Penting untuk meletakkan tombol toggle di pojok
            }}
         >
            {/* TOMBOL TOGGLE MODE GELAP/TERANG DI POJOK KANAN ATAS */}
            <Box sx={{ position: 'absolute', top: 24, right: 24 }}>
               <IconButton onClick={colorMode.toggleColorMode} color="inherit" title="Ubah Tema">
                  {theme.palette.mode === 'dark' ? <LightMode sx={{ color: '#FFD700' }} /> : <DarkMode sx={{ color: '#1A2027' }} />}
               </IconButton>
            </Box>

            <Box sx={{ width: '100%', maxWidth: 320, mx: 'auto' }}>

               {animatedElement(
                  <Box sx={{ mb: 5 }}>
                     <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', mb: 2 }}>
                        Move <span style={{ color: theme.palette.primary.main }}>Smart</span> <br />
                        with Analysis.
                     </Typography>
                     <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        Selamat Datang di Portal Guru BK.
                     </Typography>
                  </Box>
                  , 0)}

               <Box component="form" onSubmit={handleLogin} noValidate>

                  {status && animatedElement(
                     <Alert severity={status.type} sx={{ mb: 2, borderRadius: '12px' }}>
                        {status.message}
                     </Alert>
                     , 1)}

                  {animatedElement(
                     <TextField margin="normal" required fullWidth label="Username" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} />
                     , 2)}

                  {animatedElement(
                     <TextField
                        margin="normal" required fullWidth label="Password"
                        type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                           endAdornment: (
                              <InputAdornment position="end">
                                 <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                 </IconButton>
                              </InputAdornment>
                           ),
                        }}
                     />
                     , 3)}

                  {animatedElement(
                     <Button
                        type="submit" fullWidth variant="contained" disableElevation
                        sx={{
                           mt: 4, py: 1.8, fontSize: '1rem', fontWeight: 700, borderRadius: '100px',
                           bgcolor: 'primary.main', color: '#fff', textTransform: 'none', position: 'relative',
                           transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', overflow: 'hidden',
                           '&:hover': {
                              bgcolor: 'primary.dark', transform: 'translateY(-2px)',
                              boxShadow: theme.palette.mode === 'dark' ? '0 8px 16px rgba(51,153,255,0.4)' : '0 8px 16px rgba(0,127,255,0.24)',
                              pr: 4
                           },
                           '& .arrow-icon': { position: 'absolute', right: -20, opacity: 0, transition: 'all 0.3s ease' },
                           '&:hover .arrow-icon': { right: 20, opacity: 1 }
                        }}
                     >
                        Masuk Ke Dashboard
                        <ArrowForward className="arrow-icon" sx={{ fontSize: 20 }} />
                     </Button>
                     , 4)}

               </Box>
            </Box>
         </Box>
      </Box>
   );
}