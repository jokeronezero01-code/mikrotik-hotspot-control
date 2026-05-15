import { Module } from '@nestjs/common';
import { MikrotikService } from './mikrotik.service';
import { MikrotikController } from './mikrotik.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [MikrotikService, PrismaService], // เพิ่ม PrismaService เข้าไป
  controllers: [MikrotikController],
})
export class MikrotikModule {}