import { Controller, Get, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(
        private dashboardService: DashboardService
    ) { }

    @Get("recent-uploads")
    async getRecentUploads(
        @Req() req
    ) {
        return await this.dashboardService.recentUploads(req.user.role, req.user.id)
    }
}
