// File: frontend/src/app/dashboard/page.tsx
'use client';

import { Typography, Box, Grid, Paper } from '@mui/material';

export default function DashboardPage() {
   return (
      <Box>
         <Typography variant="h4" fontWeight="bold" gutterBottom>
            Beranda
         </Typography>
         <Typography variant="body1" color="text.secondary" mb={4}>
            Selamat datang di Sistem Informasi Risiko Perundungan. Berikut adalah ringkasan data saat ini.
         </Typography>

         {/* Kartu Ringkasan */}
         <Grid container spacing={3}>

            {/* PERBAIKAN: Menggunakan prop 'size' pengganti 'item xs={12} sm={4}' untuk MUI v6 */}
            <Grid size={{ xs: 12, sm: 4 }}>
               <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>Total Siswa</Typography>
                  <Typography variant="h3" fontWeight="bold" color="primary.main" mt={1}>0</Typography>
               </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
               <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>Kriteria AHP</Typography>
                  {/* Angka diubah menjadi 5 sesuai dengan laporan PDF */}
                  <Typography variant="h3" fontWeight="bold" color="success.main" mt={1}>5</Typography>
               </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
               <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>Siswa Risiko Tinggi</Typography>
                  <Typography variant="h3" fontWeight="bold" color="error.main" mt={1}>0</Typography>
               </Paper>
            </Grid>

         </Grid>
      </Box>
   );
}