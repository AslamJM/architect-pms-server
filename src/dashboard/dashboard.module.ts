import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { UploadsModule } from 'src/uploads/uploads.module';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [UploadsModule],
  providers: [DashboardService],
  controllers: [DashboardController]
})
export class DashboardModule { }
