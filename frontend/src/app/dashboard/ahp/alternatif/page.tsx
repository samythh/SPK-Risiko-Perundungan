// File: frontend/src/app/dashboard/ahp/alternatif/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Box, Typography, Paper, Tabs, Tab, Alert, Button, useTheme,
  Radio, Tooltip, Divider, CircularProgress, Snackbar, Grid,
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  Chip // PERBAIKAN 1: Menambahkan Chip ke dalam daftar import
} from '@mui/material';
import { Save, AssignmentInd, CheckCircle, WarningAmber } from '@mui/icons-material';

interface Siswa {
  id: number;
  nis: string;
  nama: string;
  kelas: string;
}

const kriteriaDetail = [
  { kode: 'C1', nama: 'Laporan Teman' },
  { kode: 'C2', nama: 'Ujaran Kebencian' },
  { kode: 'C3', nama: 'Absensi' },
  { kode: 'C4', nama: 'Prestasi' },
  { kode: 'C5', nama: 'Keaktifan Ekskul' }
];

const saatyScale = [
  { val: 'L9', num: '9', tip: 'Kiri Mutlak Lebih Parah/Penting' },
  { val: 'L7', num: '7', tip: 'Kiri Sangat Lebih Parah/Penting' },
  { val: 'L5', num: '5', tip: 'Kiri Jelas Lebih Parah/Penting' },
  { val: 'L3', num: '3', tip: 'Kiri Sedikit Lebih Parah/Penting' },
  { val: 'E1', num: '1', tip: 'Sama Saja' },
  { val: 'R3', num: '3', tip: 'Kanan Sedikit Lebih Parah/Penting' },
  { val: 'R5', num: '5', tip: 'Kanan Jelas Lebih Parah/Penting' },
  { val: 'R7', num: '7', tip: 'Kanan Sangat Lebih Parah/Penting' },
  { val: 'R9', num: '9', tip: 'Kanan Mutlak Lebih Parah/Penting' },
];

const RI_TABLE = [0, 0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49, 1.51, 1.48, 1.56, 1.57, 1.59];

const computeMatrixValue = (rowId: string, colId: string, answers: Record<string, string>): number => {
  if (rowId === colId) return 1.0;
  let val = answers[`${rowId}_${colId}`];
  let isInverse = false;
  
  if (!val) { val = answers[`${colId}_${rowId}`]; isInverse = true; }
  if (!val) return 1.0; 

  const dir = val.charAt(0);
  const num = parseInt(val.substring(1));
  if (dir === 'E') return 1.0;

  if (!isInverse) return dir === 'L' ? num : 1 / num;
  else return dir === 'L' ? 1 / num : num;
};

export default function AhpAlternatifPage() {
  const theme = useTheme();
  
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [isLoadingSiswa, setIsLoadingSiswa] = useState(true);
  const [activeKriteriaIdx, setActiveKriteriaIdx] = useState(0);

  const [answers, setAnswers] = useState<Record<string, Record<string, string>>>({
    C1: {}, C2: {}, C3: {}, C4: {}, C5: {}
  });

  const [notify, setNotify] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' });

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/siswa');
        if (res.ok) {
          const json = await res.json();
          setSiswaList(json.data);
        } else {
          throw new Error('Gagal menarik data siswa');
        }
      } catch (error) {
        console.error("Error saat fetch siswa:", error);
        setNotify({ open: true, message: 'Server Backend mati atau bermasalah.', type: 'error' });
      } finally {
        setIsLoadingSiswa(false);
      }
    };
    fetchSiswa();
  }, []);

  const pairs: { id: string; left: Siswa; right: Siswa }[] = [];
  for (let i = 0; i < siswaList.length; i++) {
    for (let j = i + 1; j < siswaList.length; j++) {
      pairs.push({
        id: `${siswaList[i].id}_${siswaList[j].id}`, 
        left: siswaList[i], right: siswaList[j]
      });
    }
  }

  const currentKriteria = kriteriaDetail[activeKriteriaIdx].kode;
  const currentAnswers = answers[currentKriteria];
  const isFormComplete = pairs.length > 0 && Object.keys(currentAnswers).length === pairs.length;

  const handleRadioChange = (pairId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [currentKriteria]: { ...prev[currentKriteria], [pairId]: value } }));
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveKriteriaIdx(newValue);
  };

  const ahpResult = useMemo(() => {
    if (!isFormComplete || siswaList.length < 2) return null;

    const n = siswaList.length;
    const matrix = siswaList.map(row => 
      siswaList.map(col => computeMatrixValue(row.id.toString(), col.id.toString(), currentAnswers))
    );

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

    const CI = (lambdaMax - n) / (n - 1) || 0;
    const RI = RI_TABLE[n] !== undefined ? RI_TABLE[n] : 1.59; 
    const CR = RI === 0 ? 0 : CI / RI;

    return { matrix, colSums, weights, lambdaMax, CI, CR };
  }, [currentAnswers, siswaList, isFormComplete]);

  const isConsistent = ahpResult ? ahpResult.CR <= 0.1 : false;

  const handleSimpanBobotAlternatif = () => {
    setNotify({ open: true, message: `Penilaian untuk ${currentKriteria} disimpan sementara!`, type: 'success' });
  };

  if (isLoadingSiswa) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="50vh">
        <CircularProgress />
        <Typography mt={2} color="text.secondary">Memuat data siswa...</Typography>
      </Box>
    );
  }

  if (siswaList.length < 2) {
    return (
      <Alert severity="warning" sx={{ borderRadius: 2 }}>
        Anda harus memiliki <b>minimal 2 siswa</b> di Master Data Siswa untuk melakukan perbandingan.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>Penilaian Alternatif (Siswa)</Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>Bandingkan tingkat keparahan/performa antar siswa untuk masing-masing kriteria.</Typography>

      <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', overflow: 'hidden', bgcolor: 'background.paper' }}>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
          <Tabs value={activeKriteriaIdx} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ '& .MuiTab-root': { fontWeight: 'bold', py: 2 } }}>
            {kriteriaDetail.map((k) => <Tab key={k.kode} icon={<AssignmentInd fontSize="small"/>} iconPosition="start" label={`${k.kode} - ${k.nama}`} />)}
          </Tabs>
        </Box>

        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
            Fokus penilaian saat ini: <b>{kriteriaDetail[activeKriteriaIdx].nama}</b>. <br/>
            Tentukan siswa mana yang kondisinya lebih menonjol (atau lebih parah) pada kriteria ini.
          </Alert>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {pairs.map((pair, index) => (
              <Paper key={pair.id} variant="outlined" sx={{ p: 2, borderRadius: 3, '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.2s' }}>
                <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ display: 'block', mb: 1.5, textAlign: 'center' }}>PERTANDINGAN {index + 1}</Typography>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                  <Box sx={{ width: { xs: '100%', lg: '25%' }, textAlign: { xs: 'center', lg: 'right' } }}>
                    <Typography fontWeight="bold" color={currentAnswers[pair.id]?.startsWith('L') ? 'primary.main' : 'text.primary'}>{pair.left.nama}</Typography>
                    <Typography variant="caption" color="text.secondary">{pair.left.kelas}</Typography>
                  </Box>
                  <Box sx={{ width: { xs: '100%', lg: '50%' }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : '#f8fafc', p: 1, borderRadius: 50, border: '1px solid', borderColor: 'divider' }}>
                    {saatyScale.map((scale) => (
                      <Tooltip key={scale.val} title={scale.tip} arrow placement="top">
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleRadioChange(pair.id, scale.val)}>
                          <Typography variant="caption" sx={{ fontWeight: scale.val === 'E1' ? 'bold' : 'normal', color: currentAnswers[pair.id] === scale.val ? 'primary.main' : 'text.secondary' }}>{scale.num}</Typography>
                          <Radio size="small" checked={currentAnswers[pair.id] === scale.val} onChange={() => handleRadioChange(pair.id, scale.val)} sx={{ p: 0.5, color: scale.val === 'E1' ? 'text.disabled' : 'default' }} />
                        </Box>
                      </Tooltip>
                    ))}
                  </Box>
                  <Box sx={{ width: { xs: '100%', lg: '25%' }, textAlign: { xs: 'center', lg: 'left' } }}>
                    <Typography fontWeight="bold" color={currentAnswers[pair.id]?.startsWith('R') ? 'primary.main' : 'text.primary'}>{pair.right.nama}</Typography>
                    <Typography variant="caption" color="text.secondary">{pair.right.kelas}</Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>

          {ahpResult && isFormComplete && (
            <Box sx={{ mt: 5 }}>
              <Divider sx={{ mb: 4 }}>
                <Chip label={`Hasil AHP: ${kriteriaDetail[activeKriteriaIdx].nama}`} color="primary" />
              </Divider>

              <Grid container spacing={4}>
                {/* PERBAIKAN 2: Menggunakan format size={{ xs: 12, md: 7 }} sesuai MUI v6 */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>Bobot Lokal Siswa</Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, boxShadow: 'none' }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Nama Siswa</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Bobot (Prioritas)</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'bold', color: 'success.main' }}>Persentase</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {siswaList.map((siswa, idx) => (
                          <TableRow key={siswa.id}>
                            <TableCell sx={{ fontWeight: 'bold' }}>{siswa.nama}</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{ahpResult.weights[idx].toFixed(4)}</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold', color: 'success.main' }}>{(ahpResult.weights[idx] * 100).toFixed(1)} %</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {/* PERBAIKAN 2: Menggunakan format size={{ xs: 12, md: 5 }} */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>Uji Konsistensi</Typography>
                  <Box sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="text.secondary">Lambda Max (λ)</Typography>
                      <Typography fontWeight="bold">{ahpResult.lambdaMax.toFixed(4)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography color="text.secondary">Consistency Index (CI)</Typography>
                      <Typography fontWeight="bold">{ahpResult.CI.toFixed(4)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                      <Typography color="text.secondary">Random Index (RI) untuk n={siswaList.length}</Typography>
                      <Typography fontWeight="bold">{RI_TABLE[siswaList.length] !== undefined ? RI_TABLE[siswaList.length] : 1.59}</Typography>
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
                  Rasio Konsistensi (CR) Anda melebihi 10%. Silakan cek ulang penilaian matriks di atas agar hasilnya logis.
                </Alert>
              )}
            </Box>
          )}

          <Divider sx={{ my: 4 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              startIcon={<Save />} 
              onClick={handleSimpanBobotAlternatif} 
              sx={{ borderRadius: '12px', py: 1.5, px: 3, fontWeight: 'bold' }}
              disabled={!isFormComplete || !isConsistent}
            >
              {isFormComplete ? `Simpan Penilaian ${kriteriaDetail[activeKriteriaIdx].nama}` : `Selesaikan ${pairs.length - Object.keys(currentAnswers).length} Penilaian Lagi`}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar open={notify.open} autoHideDuration={3000} onClose={() => setNotify({ ...notify, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setNotify({ ...notify, open: false })} severity={notify.type} variant="filled" sx={{ width: '100%' }}>{notify.message}</Alert>
      </Snackbar>
    </Box>
  );
}