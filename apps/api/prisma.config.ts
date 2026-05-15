import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// โหลดค่าจากไฟล์ .env ในโฟลเดอร์เดียวกัน
dotenv.config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});