import { Controller, Get, Query } from '@nestjs/common';
import { MikrotikService } from './mikrotik.service';

@Controller('mikrotik')
export class MikrotikController {
  constructor(private readonly mikrotikService: MikrotikService) {}

  // API สำหรับทดสอบดึงข้อมูล Resource โดยส่งค่าผ่าน Query String
  // ตัวอย่าง: http://localhost:3000/mikrotik/resource?host=192.168.88.1&user=admin&pass=1234
  @Get('resource')
  async getResource(
    @Query('host') host: string,
    @Query('user') user: string,
    @Query('pass') pass: string,
  ) {
    return await this.mikrotikService.getSystemResource(host, user, pass);
  }

  @Get('users')
  async getUsers(
    @Query('host') host: string,
    @Query('user') user: string,
    @Query('pass') pass: string,
  ) {
    return this.mikrotikService.getHotspotUsers(host, user, pass);
  }
}

