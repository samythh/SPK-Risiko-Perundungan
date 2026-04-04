// File: frontend/src/app/dashboard/layout.tsx
'use client';

import { useState, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
   Box, Drawer, AppBar, Toolbar, Typography, List, ListItem,
   ListItemButton, ListItemIcon, ListItemText, IconButton, useTheme, Divider,
   Collapse, Tooltip
} from '@mui/material';
import {
   Dashboard, Group, ListAlt, AccountCircle, Settings,
   ExpandLess, ExpandMore, Menu, ChevronLeft, Calculate,
   TableChart, Assessment, Flag, LightMode, DarkMode, Logout
} from '@mui/icons-material';

import { ColorModeContext } from '@/components/ThemeRegistry';

const drawerWidth = 280;
const collapsedDrawerWidth = 80;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
   const theme = useTheme();
   const colorMode = useContext(ColorModeContext);
   const router = useRouter();
   const pathname = usePathname();

   const [openSidebar, setOpenSidebar] = useState(true);
   const [openAhpMenu, setOpenAhpMenu] = useState(false);

   const toggleSidebar = () => setOpenSidebar(!openSidebar);
   const toggleAhpMenu = () => setOpenAhpMenu(!openAhpMenu);

   const handleLogout = () => router.push('/login');

   return (
      <Box sx={{ display: 'flex' }}>

         {/* 1. HEADER (APP BAR) */}
         <AppBar
            position="fixed"
            elevation={0}
            sx={{
               width: `calc(100% - ${openSidebar ? drawerWidth : collapsedDrawerWidth}px)`,
               ml: `${openSidebar ? drawerWidth : collapsedDrawerWidth}px`,
               transition: theme.transitions.create(['width', 'margin'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
               }),
               backgroundColor: 'background.paper',
               borderBottom: '1px solid',
               borderColor: 'divider',
               color: 'text.primary'
            }}
         >
            <Toolbar>
               <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 600 }}>
                  Portal Guru BK
               </Typography>
               <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                  {theme.palette.mode === 'dark' ? <LightMode sx={{ color: '#FFD700' }} /> : <DarkMode />}
               </IconButton>
            </Toolbar>
         </AppBar>

         {/* 2. SIDEBAR (DRAWER) */}
         <Drawer
            variant="permanent"
            sx={{
               width: openSidebar ? drawerWidth : collapsedDrawerWidth,
               flexShrink: 0,
               whiteSpace: 'nowrap',
               boxSizing: 'border-box',
               '& .MuiDrawer-paper': {
                  width: openSidebar ? drawerWidth : collapsedDrawerWidth,
                  transition: theme.transitions.create('width', {
                     easing: theme.transitions.easing.sharp,
                     duration: theme.transitions.duration.enteringScreen,
                  }),
                  overflowX: 'hidden',
                  backgroundColor: 'background.paper',
                  borderRight: '1px solid',
                  borderColor: 'divider',
               },
            }}
         >
            {/* PERBAIKAN 1: Area Logo & Tombol dengan animasi lebar dan transparansi */}
            <Toolbar sx={{ display: 'flex', alignItems: 'center', px: 2, justifyContent: 'space-between' }}>
               <Typography
                  variant="h5"
                  sx={{
                     fontWeight: 800, color: 'primary.main', letterSpacing: '-1px',
                     opacity: openSidebar ? 1 : 0,
                     width: openSidebar ? 'auto' : 0,
                     transition: 'opacity 0.3s ease, width 0.3s ease',
                     overflow: 'hidden'
                  }}
               >
                  SIRP<span style={{ color: theme.palette.text.primary }}>.App</span>
               </Typography>

               <IconButton onClick={toggleSidebar} sx={{ ml: openSidebar ? 0 : 'auto', transition: 'margin 0.3s ease' }}>
                  {openSidebar ? <ChevronLeft /> : <Menu />}
               </IconButton>
            </Toolbar>

            <Divider />

            <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flexGrow: 1, px: 2, pt: 2 }}>

               {/* PERBAIKAN 2: Judul Kategori transisi Opacity */}
               <Typography
                  variant="caption"
                  sx={{
                     color: 'text.secondary', fontWeight: 'bold', ml: 2, mb: 1, display: 'block',
                     opacity: openSidebar ? 1 : 0,
                     height: openSidebar ? 'auto' : 0,
                     transition: 'all 0.3s ease',
                  }}
               >
                  MASTER DATA
               </Typography>

               <List disablePadding>
                  {/* Menu Dashboard */}
                  <Tooltip title={!openSidebar ? "Dashboard" : ""} placement="right">
                     <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                           onClick={() => router.push('/dashboard')}
                           selected={pathname === '/dashboard'}
                           sx={{ borderRadius: '12px', '&.Mui-selected': { bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } } }}
                        >
                           <ListItemIcon sx={{ minWidth: 40, color: pathname === '/dashboard' ? 'inherit' : 'text.secondary' }}><Dashboard /></ListItemIcon>
                           {/* PERBAIKAN 3: Transisi Opacity pada List Item Text */}
                           <ListItemText
                              primary="Dashboard"
                              primaryTypographyProps={{ fontWeight: 500 }}
                              sx={{ opacity: openSidebar ? 1 : 0, transition: 'opacity 0.3s ease' }}
                           />
                        </ListItemButton>
                     </ListItem>
                  </Tooltip>

                  {/* Menu Data Kriteria */}
                  <Tooltip title={!openSidebar ? "Data Kriteria" : ""} placement="right">
                     <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                           onClick={() => router.push('/dashboard/kriteria')}
                           selected={pathname === '/dashboard/kriteria'}
                           sx={{ borderRadius: '12px', '&.Mui-selected': { bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } } }}
                        >
                           <ListItemIcon sx={{ minWidth: 40, color: pathname === '/dashboard/kriteria' ? 'inherit' : 'text.secondary' }}><ListAlt /></ListItemIcon>
                           <ListItemText
                              primary="Data Kriteria"
                              primaryTypographyProps={{ fontWeight: 500 }}
                              sx={{ opacity: openSidebar ? 1 : 0, transition: 'opacity 0.3s ease' }}
                           />
                        </ListItemButton>
                     </ListItem>
                  </Tooltip>

                  {/* Menu Data Siswa */}
                  <Tooltip title={!openSidebar ? "Data Siswa" : ""} placement="right">
                     <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                           onClick={() => router.push('/dashboard/siswa')}
                           selected={pathname.startsWith('/dashboard/siswa')}
                           sx={{ borderRadius: '12px', '&.Mui-selected': { bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } } }}
                        >
                           <ListItemIcon sx={{ minWidth: 40, color: pathname.startsWith('/dashboard/siswa') ? 'inherit' : 'text.secondary' }}><Group /></ListItemIcon>
                           <ListItemText
                              primary="Data Siswa"
                              primaryTypographyProps={{ fontWeight: 500 }}
                              sx={{ opacity: openSidebar ? 1 : 0, transition: 'opacity 0.3s ease' }}
                           />
                        </ListItemButton>
                     </ListItem>
                  </Tooltip>

                  {/* Menu Dropdown Proses AHP */}
                  <Tooltip title={!openSidebar ? "Proses AHP" : ""} placement="right">
                     <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                           onClick={() => {
                              if (!openSidebar) setOpenSidebar(true);
                              toggleAhpMenu();
                           }}
                           sx={{ borderRadius: '12px', bgcolor: pathname.includes('/ahp') ? 'action.selected' : 'transparent' }}
                        >
                           <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}><Calculate /></ListItemIcon>
                           <ListItemText
                              primary="Proses AHP"
                              primaryTypographyProps={{ fontWeight: 500 }}
                              sx={{ opacity: openSidebar ? 1 : 0, transition: 'opacity 0.3s ease' }}
                           />
                           {/* Animasi panah ikut memudar saat sidebar ditutup */}
                           <Box sx={{ opacity: openSidebar ? 1 : 0, transition: 'opacity 0.3s ease', display: 'flex', alignItems: 'center' }}>
                              {openAhpMenu ? <ExpandLess /> : <ExpandMore />}
                           </Box>
                        </ListItemButton>
                     </ListItem>
                  </Tooltip>

                  {/* Anak Menu Dropdown AHP */}
                  <Collapse in={openSidebar && openAhpMenu} timeout="auto" unmountOnExit>
                     <List component="div" disablePadding sx={{ pl: 4 }}>
                        <ListItemButton
                           onClick={() => router.push('/dashboard/ahp/kriteria')}
                           selected={pathname === '/dashboard/ahp/kriteria'}
                           sx={{ borderRadius: '12px', mb: 0.5, py: 0.5, '&.Mui-selected': { bgcolor: 'primary.light', color: 'white' } }}
                        >
                           <ListItemIcon sx={{ minWidth: 35 }}><TableChart fontSize="small" /></ListItemIcon>
                           <ListItemText primary="Matriks Kriteria" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                        </ListItemButton>
                        <ListItemButton
                           onClick={() => router.push('/dashboard/ahp/alternatif')}
                           selected={pathname === '/dashboard/ahp/alternatif'}
                           sx={{ borderRadius: '12px', mb: 0.5, py: 0.5, '&.Mui-selected': { bgcolor: 'primary.light', color: 'white' } }}
                        >
                           <ListItemIcon sx={{ minWidth: 35 }}><Assessment fontSize="small" /></ListItemIcon>
                           <ListItemText primary="Matriks Alternatif" primaryTypographyProps={{ fontSize: '0.9rem' }} />
                        </ListItemButton>
                     </List>
                  </Collapse>

                  {/* Menu Hasil Akhir */}
                  <Tooltip title={!openSidebar ? "Hasil Akhir" : ""} placement="right">
                     <ListItem disablePadding sx={{ mb: 2 }}>
                        <ListItemButton
                           onClick={() => router.push('/dashboard/hasil')}
                           selected={pathname === '/dashboard/hasil'}
                           sx={{ borderRadius: '12px', '&.Mui-selected': { bgcolor: 'success.main', color: 'white', '&:hover': { bgcolor: 'success.dark' } } }}
                        >
                           <ListItemIcon sx={{ minWidth: 40, color: pathname === '/dashboard/hasil' ? 'inherit' : 'text.secondary' }}><Flag /></ListItemIcon>
                           <ListItemText
                              primary="Hasil Akhir"
                              primaryTypographyProps={{ fontWeight: 500 }}
                              sx={{ opacity: openSidebar ? 1 : 0, transition: 'opacity 0.3s ease' }}
                           />
                        </ListItemButton>
                     </ListItem>
                  </Tooltip>
               </List>

               <Divider sx={{ my: 1 }} />

               {/* --- KATEGORI: MASTER USER --- */}
               <Typography
                  variant="caption"
                  sx={{
                     color: 'text.secondary', fontWeight: 'bold', ml: 2, mb: 1, mt: 2, display: 'block',
                     opacity: openSidebar ? 1 : 0, height: openSidebar ? 'auto' : 0, transition: 'all 0.3s ease'
                  }}
               >
                  MASTER USER
               </Typography>

               <List disablePadding>
                  <Tooltip title={!openSidebar ? "Data User" : ""} placement="right">
                     <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton sx={{ borderRadius: '12px' }}>
                           <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}><AccountCircle /></ListItemIcon>
                           <ListItemText primary="Data User" sx={{ opacity: openSidebar ? 1 : 0, transition: 'opacity 0.3s ease' }} />
                        </ListItemButton>
                     </ListItem>
                  </Tooltip>
                  <Tooltip title={!openSidebar ? "Pengaturan Akun" : ""} placement="right">
                     <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton sx={{ borderRadius: '12px' }}>
                           <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}><Settings /></ListItemIcon>
                           <ListItemText primary="Pengaturan" sx={{ opacity: openSidebar ? 1 : 0, transition: 'opacity 0.3s ease' }} />
                        </ListItemButton>
                     </ListItem>
                  </Tooltip>
               </List>
            </Box>

            {/* Tombol Logout */}
            <Box sx={{ p: 2 }}>
               <Tooltip title={!openSidebar ? "Keluar" : ""} placement="right">
                  <ListItemButton
                     onClick={handleLogout}
                     sx={{ borderRadius: '12px', color: 'error.main', bgcolor: 'error.light', '&:hover': { bgcolor: 'error.main', color: 'white' } }}
                  >
                     <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><Logout /></ListItemIcon>
                     <ListItemText
                        primary="Keluar"
                        primaryTypographyProps={{ fontWeight: 600 }}
                        sx={{ opacity: openSidebar ? 1 : 0, transition: 'opacity 0.3s ease' }}
                     />
                  </ListItemButton>
               </Tooltip>
            </Box>
         </Drawer>

         {/* 3. KONTEN UTAMA */}
         <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 4, minHeight: '100vh', width: `calc(100% - ${openSidebar ? drawerWidth : collapsedDrawerWidth}px)` }}>
            <Toolbar />
            {children}
         </Box>
      </Box>
   );
}