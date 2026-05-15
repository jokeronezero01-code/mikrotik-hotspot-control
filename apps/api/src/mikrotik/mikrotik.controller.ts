import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RouterOSAPI } from 'node-routeros'; // ใช้ตัวนี้แทนครับ

@Controller('mikrotik')
export class MikrotikController {
  constructor(private readonly prisma: PrismaService) {}

  // 1. ลงทะเบียน Router
  @Post('register')
  async registerRouter(@Body() body: any) {
    return await this.prisma.router.create({
      data: { ...body, status: 'ACTIVE' },
    });
  }

  @Get('list')
  async getAllRouters() {
    return await this.prisma.router.findMany();
  }

  // 2. ดึงข้อมูล Resource จริงจาก MikroTik
  @Get('resource/:id')
  async getResource(@Param('id') id: string) {
    const router = await this.prisma.router.findUnique({ where: { id } });
    if (!router) throw new HttpException('ไม่พบเราเตอร์', HttpStatus.NOT_FOUND);

    const conn = new RouterOSAPI({
        host: router.host,
        user: router.apiUser,
        password: router.apiPass,
        port: 8728,
        timeout: 5 // วินาที
    });

    try {
      await conn.connect();
      const resources = await conn.write('/system/resource/print');
      conn.close();

      return {
        routerName: router.name,
        ip: router.host,
        data: resources[0]
      };
    } catch (err) {
      throw new HttpException(`เชื่อมต่อล้มเหลว: ${err.message}`, HttpStatus.BAD_GATEWAY);
    }
  }

  // 3. ดึงรายชื่อ Hotspot Users ของจริง
  @Get('hotspot-users/:id')
  async getHotspotUsers(@Param('id') id: string) {
    const router = await this.prisma.router.findUnique({ where: { id } });
    if (!router) throw new HttpException('ไม่พบเราเตอร์', HttpStatus.NOT_FOUND);

    const conn = new RouterOSAPI({
        host: router.host,
        user: router.apiUser,
        password: router.apiPass,
    });

    try {
      await conn.connect();
      const users = await conn.write('/ip/hotspot/user/print');
      conn.close();

      return {
        routerName: router.name,
        total: users.length,
        users: users
      };
    } catch (err) {
      throw new HttpException(`ดึงข้อมูลล้มเหลว: ${err.message}`, HttpStatus.BAD_GATEWAY);
    }
  }

  // 4. สร้าง User Hotspot ใหม่
  @Post('hotspot-users/add/:id')
  async addHotspotUser(
    @Param('id') id: string,
    @Body() body: {
      name: string;
      password?: string;
      profile?: string;
      limitUptime?: string; // เช่น '1h', '30d'
      comment?: string;
    }
  ) {
    const router = await this.prisma.router.findUnique({ where: { id } });
    if (!router) throw new HttpException('ไม่พบเราเตอร์', HttpStatus.NOT_FOUND);

    const conn = new RouterOSAPI({
      host: router.host,
      user: router.apiUser,
      password: router.apiPass,
    });

    try {
      await conn.connect();
      
      // คำสั่งสร้าง User ใน MikroTik
      const result = await conn.write('/ip/hotspot/user/add', [
        `=name=${body.name}`,
        `=password=${body.password || ''}`,
        `=profile=${body.profile || 'default'}`,
        `=limit-uptime=${body.limitUptime || '0s'}`,
        `=comment=${body.comment || 'Created by API'}`
      ]);

      conn.close();
      return {
        message: 'สร้าง User สำเร็จ',
        result: result
      };
    } catch (err) {
      throw new HttpException(`สร้าง User ล้มเหลว: ${err.message}`, HttpStatus.BAD_GATEWAY);
    }
  }
}