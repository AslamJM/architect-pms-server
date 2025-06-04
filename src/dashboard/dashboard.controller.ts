import { Controller, Get, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(
        private dashboardService: DashboardService
    ) { }

    @Get("counts")
    async getCounts() {
        return await this.dashboardService.countsFor()
    }

    @Get("recent-uploads")
    async getRecentUploads(
        @Req() req
    ) {
        return await this.dashboardService.recentUploads(req.user.role, req.user.id)
    }

    @Get("this-month")
    async thisMonthReport() {
        return await this.dashboardService.getThisMonthsReport()
    }

    @Get("recent-projects")
    async recentProjects(
        @Req() req
    ) {
        return await this.dashboardService.recentProjects(req.user.role, req.user.id)
    }
}
