// File: src/config.ts
// Deskripsi: File konfigurasi untuk Swagger UI

import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0', // Menggunakan standar OpenAPI versi 3
    info: {
      title: 'API SPK Risiko Perundungan',
      version: '1.0.0',
      description: 'Dokumentasi API untuk sistem pendukung keputusan metode AHP-TOPSIS',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  // Memberi tahu Swagger di mana mencari komentar dokumentasi API kita
  apis: ['./src/routes/*.ts'], 
};

export const swaggerSpec = swaggerJsdoc(options);