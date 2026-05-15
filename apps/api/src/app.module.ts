import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikrotikModule } from './mikrotik/mikrotik.module'; // เพิ่มบรรทัดนี้

@Module({
  imports: [MikrotikModule], // นำโมดูลมาใส่ที่นี่
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}