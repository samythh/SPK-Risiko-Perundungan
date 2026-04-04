// File: frontend/src/app/dashboard/ahp/kriteria/page.tsx
'use client';

import { useState, useMemo } from 'react';
import {
   Box, Typography, Paper, Tabs, Tab, Table, TableBody, TableCell,
   TableContainer, TableHead, TableRow, Alert, Button, Grid, useTheme,
   Radio, Tooltip, Divider, Snackbar, CircularProgress
} from '@mui/material';
import { Calculate, CheckCircle, EditNote, GridOn, PieChart, WarningAmber } from '@mui/icons-material';

const kriteriaDetail = [
   { kode: 'C1', nama: 'Laporan Teman', sifat: 'Cost' },
   { kode: 'C2', nama: 'Ujaran Kebencian', sifat: 'Cost' },
   { kode: 'C3', nama: 'Absensi', sifat: 'Cost' },
   { kode: 'C4', nama: 'Prestasi', sifat: 'Cost' },
   { kode: 'C5', nama: 'Keaktifan Ekskul', sifat: 'Benefit' }
];

const kriteria = ['C1', 'C2', 'C3', 'C4', 'C5'];
const n = kriteria.length;

const ahpPairs: { id: string; left: typeof kriteriaDetail[0]; right: typeof kriteriaDetail[0] }[] = [];
for (let i = 0; i < kriteriaDetail.length; i++) {
   for (let j = i + 1; j < kriteriaDetail.length; j++) {
      ahpPairs.push({ id: `${kriteriaDetail[i].kode}_${kriteriaDetail[j].kode}`, left: kriteriaDetail[i], right: kriteriaDetail[j] });
   }
}

const saatyScale = [
   { val: 'L9', num: '9', tip: 'Kiri Mutlak Lebih Penting' },
   { val: 'L7', num: '7', tip: 'Kiri Sangat Lebih Penting' },
   { val: 'L5', num: '5', tip: 'Kiri Jelas Lebih Penting' },
   { val: 'L3', num: '3', tip: 'Kiri Sedikit Lebih Penting' },
   { val: 'E1', num: '1', tip: 'Sama Penting' },
   { val: 'R3', num: '3', tip: 'Kanan Sedikit Lebih Penting' },
   { val: 'R5', num: '5', tip: 'Kanan Jelas Lebih Penting' },
   { val: 'R7', num: '7', tip: 'Kanan Sangat Lebih Penting' },
   { val: 'R9', num: '9', tip: 'Kanan Mutlak Lebih Penting' },
];

const computeMatrixValue = (row: string, col: string, answers: Record<string, string>): number => {
   if (row === col) return 1.0;
   let val = answers[`${row}_${col}`];
   let isInverse = false;
   if (!val) { val = answers[`${col}_${row}`]; isInverse = true; }
   if (!val) return 1.0;

   const dir = val.charAt(0);
   const num = parseInt(val.substring(1));
   if (dir === 'E') return 1.0;
   if (!isInverse) return dir === 'L' ? num : 1 / num;
   else return dir === 'L' ? 1 / num : num;
};

interface TabPanelProps {
   children?: React.ReactNode;
   index: number;
   value: number;
}
function CustomTabPanel(props: TabPanelProps) {
   const { children, value, index, ...other } = props;
   return (
      <div role="tabpanel" hidden={value !== index} style={{ flexGrow: 1, width: '100%' }} {...other}>
         {value === index && <Box sx={{ p: { xs: 3, md: 4 } }}>{children}</Box>}
      </div>
   );
}

export default function AhpKriteriaPage() {
   const [tabValue, setTabValue] = useState(0);
   const theme = useTheme();
   const [answers, setAnswers] = useState<Record<string, string>>({});

   // State untuk Notifikasi & Loading Simpan Database
   const [isSaving, setIsSaving] = useState(false);
   const [notify, setNotify] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' });

   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => setTabValue(newValue);
   const handleRadioChange = (pairId: string, value: string) => setAnswers(prev => ({ ...prev, [pairId]: value }));

   const ahpResult = useMemo(() => {
      const matrix = kriteria.map(row => kriteria.map(col => computeMatrixValue(row, col, answers)));
      const colSums = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
         for (let j = 0; j < n; j++) colSums[i] += matrix[j][i];
      }
      const weights = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
         let rowSum = 0;
         for (let j = 0; j < n; j++) rowSum += (matrix[i][j] / colSums[j]);
         weights[i] = rowSum / n;
      }
      let lambdaMax = 0;
      for (let i = 0; i < n; i++) lambdaMax += colSums[i] * weights[i];

      const CI = (lambdaMax - n) / (n - 1);
      const RI = 1.12;
      const CR = CI / RI;

      return { colSums, weights, lambdaMax, CI, CR };
   }, [answers]);

   const isConsistent = ahpResult.CR <= 0.1;

   // FUNGSI POST: Mengirim Data Bobot ke Backend
   const handleSimpanBobot = async () => {
      setIsSaving(true);
      try {
         // Merakit payload JSON sesuai yang dibutuhkan API Backend
         const payload = {
            weights: kriteria.map((kodeKriteria, idx) => ({
               kode: kodeKriteria,
               nama: kriteriaDetail[idx].nama,
               sifat: kriteriaDetail[idx].sifat,
               bobot: ahpResult.weights[idx]
            }))
         };

         const response = await fetch('http://localhost:8000/api/kriteria/bobot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
         });

         const result = await response.json();

         if (response.ok) {
            setNotify({ open: true, message: result.message, type: 'success' });
         } else {
            setNotify({ open: true, message: result.message || 'Gagal menyimpan data.', type: 'error' });
         }
      } catch (error) {
         console.error("Error saving weights:", error);
         setNotify({ open: true, message: 'Gagal terhubung ke server Backend.', type: 'error' });
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <Box>
         <Typography variant="h4" fontWeight="bold" gutterBottom>Proses AHP: Kriteria</Typography>
         <Typography variant="body1" color="text.secondary" mb={4}>Ikuti tahapan di menu samping untuk menyelesaikan matriks perbandingan kriteria.</Typography>

         <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'flex-start' }}>

            <Paper elevation={0} sx={{ width: { xs: '100%', md: 260 }, flexShrink: 0, borderRadius: '16px', border: '1px solid', borderColor: 'divider', overflow: 'hidden', bgcolor: 'background.paper' }}>
               <Tabs orientation="vertical" value={tabValue} onChange={handleTabChange} TabIndicatorProps={{ style: { left: 0, right: 'auto', width: 4, borderRadius: '0 4px 4px 0' } }} sx={{ '& .MuiTab-root': { alignItems: 'flex-start', textAlign: 'left', px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider', textTransform: 'none', fontSize: '0.95rem', flexDirection: 'row', justifyContent: 'flex-start', gap: 1.5, transition: 'all 0.2s' }, '& .Mui-selected': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 127, 255, 0.1)' : '#f0f7ff', fontWeight: 'bold', color: 'primary.main' } }}>
                  <Tab icon={<EditNote />} label="1. Input Penilaian" />
                  <Tab icon={<GridOn />} label="2. Matriks Berpasangan" />
                  <Tab icon={<PieChart />} label="3. Hasil & Bobot" />
               </Tabs>
            </Paper>

            <Paper elevation={0} sx={{ flexGrow: 1, minHeight: '65vh', width: '100%', borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', overflowY: 'auto' }}>

               {/* TAB 1 & TAB 2 (Disembunyikan kodenya untuk keterbacaan, sama persis seperti sebelumnya) */}
               <CustomTabPanel value={tabValue} index={0}>
                  <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>Tentukan seberapa penting sebuah kriteria dibandingkan kriteria lainnya menggunakan skala 1-9.</Alert>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                     {ahpPairs.map((pair, index) => (
                        <Paper key={pair.id} variant="outlined" sx={{ p: 2, borderRadius: 3, '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.2s' }}>
                           <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ display: 'block', mb: 1.5, textAlign: 'center' }}>PERBANDINGAN {index + 1}</Typography>
                           <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                              <Box sx={{ width: { xs: '100%', lg: '25%' }, textAlign: { xs: 'center', lg: 'right' } }}>
                                 <Typography fontWeight="bold" color={answers[pair.id]?.startsWith('L') ? 'primary.main' : 'text.primary'}>{pair.left.kode} - {pair.left.nama}</Typography>
                              </Box>
                              <Box sx={{ width: { xs: '100%', lg: '50%' }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : '#f8fafc', p: 1, borderRadius: 50, border: '1px solid', borderColor: 'divider' }}>
                                 {saatyScale.map((scale) => (
                                    <Tooltip key={scale.val} title={scale.tip} arrow placement="top">
                                       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleRadioChange(pair.id, scale.val)}>
                                          <Typography variant="caption" sx={{ fontWeight: scale.val === 'E1' ? 'bold' : 'normal', color: answers[pair.id] === scale.val ? 'primary.main' : 'text.secondary' }}>{scale.num}</Typography>
                                          <Radio size="small" checked={answers[pair.id] === scale.val} onChange={() => handleRadioChange(pair.id, scale.val)} sx={{ p: 0.5, color: scale.val === 'E1' ? 'text.disabled' : 'default' }} />
                                       </Box>
                                    </Tooltip>
                                 ))}
                              </Box>
                              <Box sx={{ width: { xs: '100%', lg: '25%' }, textAlign: { xs: 'center', lg: 'left' } }}>
                                 <Typography fontWeight="bold" color={answers[pair.id]?.startsWith('R') ? 'primary.main' : 'text.primary'}>{pair.right.kode} - {pair.right.nama}</Typography>
                              </Box>
                           </Box>
                        </Paper>
                     ))}
                  </Box>
                  <Divider sx={{ my: 4 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                     <Button variant="contained" endIcon={<Calculate />} onClick={() => setTabValue(1)} sx={{ borderRadius: '12px', py: 1.5, px: 3, fontWeight: 'bold' }} disabled={Object.keys(answers).length < 10}>
                        {Object.keys(answers).length < 10 ? `Selesaikan ${10 - Object.keys(answers).length} Penilaian Lagi` : 'Lihat Matriks'}
                     </Button>
                  </Box>
               </CustomTabPanel>

               <CustomTabPanel value={tabValue} index={1}>
                  <Typography variant="h6" fontWeight="bold" mb={1}>Matriks Perbandingan Berpasangan</Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ mb: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                     <Table>
                        <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                           <TableRow>
                              <TableCell sx={{ fontWeight: 'bold' }}>Kriteria</TableCell>
                              {kriteria.map((k) => <TableCell key={k} align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{k}</TableCell>)}
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {kriteria.map((row) => (
                              <TableRow key={row}>
                                 <TableCell sx={{ fontWeight: 'bold', color: 'primary.main', bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>{row}</TableCell>
                                 {kriteria.map((col) => {
                                    const val = computeMatrixValue(row, col, answers);
                                    return <TableCell key={col} align="center" sx={{ bgcolor: row === col ? 'action.hover' : 'inherit', fontWeight: row === col ? 'bold' : 'normal' }}>{val.toFixed(2)}</TableCell>;
                                 })}
                              </TableRow>
                           ))}
                           <TableRow sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                              <TableCell sx={{ fontWeight: 'bold', fontStyle: 'italic' }}>Jumlah</TableCell>
                              {ahpResult.colSums.map((sum, idx) => <TableCell key={idx} align="center" sx={{ fontWeight: 'bold' }}>{sum.toFixed(2)}</TableCell>)}
                           </TableRow>
                        </TableBody>
                     </Table>
                  </TableContainer>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                     <Button variant="outlined" onClick={() => setTabValue(0)} sx={{ borderRadius: '12px' }}>Kembali</Button>
                     <Button variant="contained" onClick={() => setTabValue(2)} sx={{ borderRadius: '12px' }}>Normalisasi</Button>
                  </Box>
               </CustomTabPanel>

               {/* TAB 3: HASIL DAN BOBOT */}
               <CustomTabPanel value={tabValue} index={2}>
                  <Grid container spacing={4}>
                     <Grid size={{ xs: 12, md: 7 }}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>Bobot Kriteria (Priority Vector)</Typography>
                        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                           <Table>
                              <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                                 <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Kriteria</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Nama</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Bobot (Prioritas)</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', color: 'success.main' }}>Persentase</TableCell>
                                 </TableRow>
                              </TableHead>
                              <TableBody>
                                 {kriteria.map((k, idx) => (
                                    <TableRow key={k}>
                                       <TableCell sx={{ fontWeight: 'bold' }}>{k}</TableCell>
                                       <TableCell color="text.secondary">{kriteriaDetail[idx].nama}</TableCell>
                                       <TableCell align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{ahpResult.weights[idx].toFixed(4)}</TableCell>
                                       <TableCell align="center" sx={{ fontWeight: 'bold', color: 'success.main' }}>{(ahpResult.weights[idx] * 100).toFixed(1)} %</TableCell>
                                    </TableRow>
                                 ))}
                              </TableBody>
                           </Table>
                        </TableContainer>
                     </Grid>

                     <Grid size={{ xs: 12, md: 5 }}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>Uji Konsistensi</Typography>
                        <Box sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Typography color="text.secondary">Lambda Max (λ)</Typography>
                              <Typography fontWeight="bold">{ahpResult.lambdaMax.toFixed(4)}</Typography>
                           </Box>
                           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                              <Typography color="text.secondary">Consistency Index (CI)</Typography>
                              <Typography fontWeight="bold">{ahpResult.CI.toFixed(4)}</Typography>
                           </Box>
                           <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                              <Typography color="text.secondary">Random Index (RI)</Typography>
                              <Typography fontWeight="bold">1.12</Typography>
                           </Box>

                           <Box sx={{ p: 2, borderRadius: 2, textAlign: 'center', bgcolor: isConsistent ? 'success.main' : 'error.main', color: '#ffffff' }}>
                              <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Consistency Ratio (CR)</Typography>
                              <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>{(ahpResult.CR * 100).toFixed(2)} %</Typography>
                              <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                                 {isConsistent ? <CheckCircle fontSize="small" /> : <WarningAmber fontSize="small" />}
                                 <Typography variant="caption" fontWeight="bold">{isConsistent ? 'KONSISTEN (CR ≤ 10%)' : 'TIDAK KONSISTEN (CR > 10%)'}</Typography>
                              </Box>
                           </Box>
                        </Box>
                     </Grid>
                  </Grid>

                  {!isConsistent && (
                     <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
                        Rasio Konsistensi (CR) Anda melebihi 10%. Silakan cek ulang matriks perbandingan Anda di Tab 1 agar penilaian lebih logis.
                     </Alert>
                  )}

                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                     <Button variant="outlined" onClick={() => setTabValue(1)} sx={{ borderRadius: '12px' }} disabled={isSaving}>Cek Ulang Matriks</Button>

                     {/* PERBAIKAN: Tombol Simpan Terhubung ke API */}
                     <Button
                        variant="contained"
                        disabled={!isConsistent || isSaving}
                        onClick={handleSimpanBobot}
                        sx={{ borderRadius: '12px', bgcolor: 'primary.main', minWidth: 200 }}
                     >
                        {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Simpan Bobot ke Database'}
                     </Button>
                  </Box>
               </CustomTabPanel>

            </Paper>
         </Box>

         {/* Komponen Snackbar untuk memunculkan notifikasi hijau/merah di pojok kanan bawah */}
         <Snackbar open={notify.open} autoHideDuration={4000} onClose={() => setNotify({ ...notify, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert onClose={() => setNotify({ ...notify, open: false })} severity={notify.type} variant="filled" sx={{ width: '100%' }}>
               {notify.message}
            </Alert>
         </Snackbar>
      </Box>
   );
}