// File: frontend/src/app/dashboard/siswa/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
   Box, Typography, Paper, Table, TableBody, TableCell,
   TableContainer, TableHead, TableRow, Button, IconButton,
   Chip, useTheme, TextField, InputAdornment, Tooltip,
   Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';

// Struktur tipe data Siswa agar TypeScript tidak protes
interface Siswa {
   id: number | string;
   nis: string;
   nama: string;
   kelas: string;
}

export default function SiswaPage() {
   const theme = useTheme();

   // State untuk Data Tabel & Pencarian
   const [siswaList, setSiswaList] = useState<Siswa[]>([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [isLoading, setIsLoading] = useState(true);

   // State untuk Modal/Dialog Tambah Siswa
   const [openDialog, setOpenDialog] = useState(false);
   const [formData, setFormData] = useState({ nis: '', nama: '', kelas: '' });
   const [isSubmitting, setIsSubmitting] = useState(false);

   // State untuk Notifikasi Pop-up (Snackbar)
   const [notify, setNotify] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' });

   // 1. FUNGSI GET: Menarik data dari Backend saat halaman pertama kali dibuka
   const fetchSiswa = async () => {
      setIsLoading(true);
      try {
         const response = await fetch('http://localhost:8000/api/siswa');
         if (response.ok) {
            const data = await response.json();
            setSiswaList(data.data); // Asumsi backend Ihsan mengembalikan { data: [...] }
         } else {
            throw new Error('Gagal mengambil data dari server.');
         }
      } catch (error) {
         console.error("Error fetching:", error);
         // Fallback: Jika server Backend mati, kita tampilkan data kosong agar UI tidak hancur
         setNotify({ open: true, message: 'Server backend (Port 8000) belum menyala.', type: 'error' });
      } finally {
         setIsLoading(false);
      }
   };

   // Jalankan fungsi GET secara otomatis saat komponen dimuat
   useEffect(() => {
      fetchSiswa();
   }, []);

   // 2. FUNGSI POST: Mengirim data formulir ke Backend
   const handleSimpan = async () => {
      // Validasi sederhana: Pastikan tidak ada kolom yang kosong
      if (!formData.nis || !formData.nama || !formData.kelas) {
         setNotify({ open: true, message: 'Semua kolom harus diisi!', type: 'error' });
         return;
      }

      setIsSubmitting(true);
      try {
         const response = await fetch('http://localhost:8000/api/siswa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
         });

         const result = await response.json();

         if (response.ok) {
            setNotify({ open: true, message: 'Siswa berhasil ditambahkan!', type: 'success' });
            setOpenDialog(false); // Tutup modal
            setFormData({ nis: '', nama: '', kelas: '' }); // Bersihkan form
            fetchSiswa(); // Tarik ulang data terbaru dari database
         } else {
            setNotify({ open: true, message: result.message || 'Gagal menyimpan.', type: 'error' });
         }
      } catch (error) {
         console.error("Error posting:", error);
         setNotify({ open: true, message: 'Gagal menghubungi server Backend.', type: 'error' });
      } finally {
         setIsSubmitting(false);
      }
   };

   // Filter siswa berdasarkan kolom pencarian
   const filteredSiswa = siswaList.filter(s =>
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nis.includes(searchTerm)
   );

   return (
      <Box>
         <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 4, gap: 2 }}>
            <Box>
               <Typography variant="h4" fontWeight="bold" gutterBottom>Master Data Siswa</Typography>
               <Typography variant="body1" color="text.secondary">Kelola data alternatif siswa yang akan dievaluasi tingkat risiko perundungannya.</Typography>
            </Box>
            <Button
               variant="contained"
               startIcon={<Add />}
               onClick={() => setOpenDialog(true)} // Buka modal saat diklik
               sx={{ borderRadius: '12px', px: 3, py: 1.5, fontWeight: 'bold' }}
            >
               Tambah Siswa Baru
            </Button>
         </Box>

         <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', overflow: 'hidden', bgcolor: 'background.paper' }}>

            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
               <Typography variant="h6" fontWeight="bold">Daftar Alternatif Siswa</Typography>
               <TextField
                  size="small" placeholder="Cari nama atau NIS..." variant="outlined"
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                     startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
                     sx: { borderRadius: '10px', bgcolor: 'background.paper', width: { xs: '100%', sm: 250 } }
                  }}
               />
            </Box>

            <TableContainer>
               <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
                     <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>NIS</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '45%' }}>Nama Lengkap</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Kelas</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', width: '20%' }}>Aksi</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {isLoading ? (
                        <TableRow>
                           <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                              <CircularProgress />
                              <Typography mt={2} color="text.secondary">Memuat data dari database...</Typography>
                           </TableCell>
                        </TableRow>
                     ) : filteredSiswa.length > 0 ? (
                        filteredSiswa.map((siswa) => (
                           <TableRow key={siswa.id} hover>
                              <TableCell color="text.secondary">{siswa.nis}</TableCell>
                              <TableCell sx={{ fontWeight: 500 }}>{siswa.nama}</TableCell>
                              <TableCell>
                                 <Chip label={siswa.kelas} size="small" sx={{ borderRadius: '6px', fontWeight: 500, bgcolor: 'action.selected' }} />
                              </TableCell>
                              <TableCell align="center">
                                 <Tooltip title="Edit Data (Segera Hadir)" arrow>
                                    <IconButton color="primary" size="small" sx={{ mr: 1 }}><Edit fontSize="small" /></IconButton>
                                 </Tooltip>
                                 <Tooltip title="Hapus Siswa (Segera Hadir)" arrow>
                                    <IconButton color="error" size="small"><Delete fontSize="small" /></IconButton>
                                 </Tooltip>
                              </TableCell>
                           </TableRow>
                        ))
                     ) : (
                        <TableRow>
                           <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                              <Typography color="text.secondary">Belum ada data siswa di database.</Typography>
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </TableContainer>
         </Paper>

         {/* --- KOMPONEN MODAL/DIALOG TAMBAH SISWA --- */}
         <Dialog open={openDialog} onClose={() => !isSubmitting && setOpenDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
            <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
               Form Pendaftaran Siswa
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
               <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                  <TextField
                     label="Nomor Induk Siswa (NIS)" variant="outlined" fullWidth required autoFocus
                     value={formData.nis} onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                  />
                  <TextField
                     label="Nama Lengkap" variant="outlined" fullWidth required
                     value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  />
                  {/* Untuk kelas, idealnya menggunakan Select Dropdown, tapi TextField cukup untuk dasar */}
                  <TextField
                     label="Kelas (Contoh: X MIPA 1)" variant="outlined" fullWidth required
                     value={formData.kelas} onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                  />
               </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
               <Button onClick={() => setOpenDialog(false)} color="inherit" disabled={isSubmitting}>Batal</Button>
               <Button onClick={handleSimpan} variant="contained" disabled={isSubmitting} sx={{ borderRadius: '8px', px: 3 }}>
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Simpan Data'}
               </Button>
            </DialogActions>
         </Dialog>

         {/* --- KOMPONEN NOTIFIKASI (SNACKBAR) --- */}
         <Snackbar open={notify.open} autoHideDuration={4000} onClose={() => setNotify({ ...notify, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert onClose={() => setNotify({ ...notify, open: false })} severity={notify.type} variant="filled" sx={{ width: '100%' }}>
               {notify.message}
            </Alert>
         </Snackbar>

      </Box>
   );
}