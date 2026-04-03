// File: backend/src/lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// Inisialisasi yang bersih dan dijamin aman dari error
const prisma = new PrismaClient();

export default prisma;