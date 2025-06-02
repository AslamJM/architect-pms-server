import { Injectable } from '@nestjs/common';
import { Role } from 'generated/prisma';
import { UploadsService } from 'src/uploads/uploads.service';

@Injectable()
export class DashboardService {

    constructor(
        private uploadService: UploadsService
    ) { }

    async recentUploads(role: Role, userId: string) {
        try {
            if (role === "ADMIN") {
                return await this.uploadService.getRecentUploadsForAdmin()
            }

            if (role === "PROJECT_MANAGER") {
                return await this.uploadService.getRecentUploadsForPM(userId)
            }

        } catch (error) {
            throw error
        }
    }
}
