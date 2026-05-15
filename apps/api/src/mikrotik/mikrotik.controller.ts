import { Controller, Get, Post, Body, Query } from '@nestjs/common'; // เพิ่ม Post และ Body ตรงนี้
import { MikrotikService } from './mikrotik.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('mikrotik')
export class MikrotikController {
  constructor(
    private readonly mikrotikService: MikrotikService,
    private readonly prisma: PrismaService,
  ) {}

  // 1. ลงทะเบียนเราเตอร์ใหม่ (บันทึกลงฐานข้อมูล)
  @Post('register')
  async registerRouter(
    @Body() data: { 
      name: string;
      host: string;
      apiUser: string;
      apiPass: string;
    },
  ) {
    return await this.prisma.router.create({
      data: {
        name: data.name,
        host: data.host,
        apiUser: data.apiUser,
        apiPass: data.apiPass,
        status: 'ACTIVE',
      },
    });
  }

  // 2. ดึงข้อมูล Resource (แบบส่งค่าสดผ่าน Query)
  @Get('resource')
  async getResource(
    @Query('host') host: string,
    @Query('user') user: string,
    @Query('pass') pass: string,
  ) {
    return await this.mikrotikService.getSystemResource(host, user, pass);
  }

  // 3. ดึงรายชื่อ User Hotspot (แบบส่งค่าสดผ่าน Query)
  @Get('users')
  async getUsers(
    @Query('host') host: string,
    @Query('user') user: string,
    @Query('pass') pass: string,
  ) {
    return this.mikrotikService.getHotspotUsers(host, user, pass);
  }
}