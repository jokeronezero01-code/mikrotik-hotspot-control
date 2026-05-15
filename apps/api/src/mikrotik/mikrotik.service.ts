import { Injectable, Logger } from '@nestjs/common';
import { RouterOSClient } from 'routeros-client';

@Injectable()
export class MikrotikService {
  private readonly logger = new Logger(MikrotikService.name);

  // ฟังก์ชันสำหรับทดสอบเชื่อมต่อและดึงข้อมูลพื้นฐาน
  async getSystemResource(host: string, user: string, pass: string) {
    const client = new RouterOSClient({
      host: host,
      user: user,
      password: pass,
      port: 8728, // พอร์ตมาตรฐาน Mikrotik API
      timeout: 5,  // รอสาย 5 วินาที
    });

    try {
      const api = await client.connect();
      this.logger.log(`Connected to Mikrotik: ${host}`);

      // ส่งคำสั่งไปดึง /system/resource
      const resources = await api.write('/system/resource/print');
      
      await api.close(); // ปิดการเชื่อมต่อทุกครั้งหลังใช้เสร็จ
      return resources[0];
    } catch (error) {
      this.logger.error(`Connection failed to ${host}: ${error.message}`);
      throw error;
    }
  }
}