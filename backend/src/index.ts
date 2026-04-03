// File: src/index.ts
import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config';
import apiRoutes from './routes/api';

dotenv.config();

const app: Application = express();

// PERUBAHAN DI SINI: 
// Kita ganti port default dari 5000 menjadi 8000 (atau 8080) agar terhindar dari konflik Windows.
const PORT = process.env.PORT || 8000;

app.use(cors()); 
app.use(express.json()); 

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server backend berjalan di http://localhost:${PORT}`);
  console.log(`📚 Dokumentasi Swagger tersedia di http://localhost:${PORT}/docs`);
});