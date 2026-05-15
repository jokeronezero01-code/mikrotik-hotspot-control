import { Injectable, Logger } from '@nestjs/common';
import { RouterOSClient } from 'routeros-client';

@Injectable()
export class MikrotikService {
  private readonly logger = new Logger(MikrotikService.name);

  async getSystemResource(host: string, user: string, pass: string) {
    const client = new RouterOSClient({
      host,
      user,
      password: pass,
      port: 8728,
      timeout: 5,
    });

    try {
      // 1. สร้างการเชื่อมต่อ
      const api = await client.connect();
      this.logger.log(`Connected to Mikrotik: ${host}`);

      // 2. ใช้เมนู menu เพื่อเข้าถึงคำสั่ง (แก้ไขตรงนี้)
      const resources = await api.menu('/system/resource').print();
      
      // 3. ปิดการเชื่อมต่อผ่านตัว client (แก้ไขตรงนี้)
      await client.close(); 
      
      return resources[0];
    } catch (error) {
      this.logger.error(`Connection failed to ${host}: ${error.message}`);
      throw error;
    }
  }
}