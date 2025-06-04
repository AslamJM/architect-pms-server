import { Injectable } from '@nestjs/common';
import { Prisma, Role } from 'generated/prisma';
import { DbService } from 'src/db/db.service';
import { UploadsService } from 'src/uploads/uploads.service';

@Injectable()
export class DashboardService {

    constructor(
        private uploadService: UploadsService,
        private db: DbService
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

    async countsFor() {
        try {
            const projects = await this.db.project.count()
            const users = await this.db.user.count()

            return {
                projects,
                users
            }
        } catch (error) {
            throw error
        }
    }

    //monthly project report for this month only
    async getThisMonthsReport() {
        try {
            const month = new Date().getMonth()
            const year = new Date().getFullYear()

            const startOfthisMonth = new Date(1, month, year)
            const endOfMonth = new Date(1, (month + 1) % 12, (month + 1 % 12 === 0 ? year + 1 : year))

            const projects = await this.db.project.findMany({
                where: {
                    created_at: {
                        gte: startOfthisMonth,
                        lt: endOfMonth
                    }
                },
                select: {
                    is_completed: true,
                    is_paid: true
                }
            })

            let completed = 0, paid = 0

            projects.forEach(p => {
                if (p.is_completed) completed++
                if (p.is_paid) paid++
            })

            return {
                completed,
                not_completed: projects.length - completed,
                paid,
                not_paid: projects.length - paid
            }

        } catch (error) {
            throw error
        }
    }

    // recent projects for admin and project manager to display in the dashboard 
    // limit 7 
    async recentProjects(role: Role, userId: string) {
        try {

            let where: Prisma.ProjectScalarWhereInput = {}

            if (role === "PROJECT_MANAGER") {
                where = { ...where, assigned_by_id: userId }
            }

            const projects = await this.db.project.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    assigned_to: { select: { name: true } },
                    created_at: true,
                    is_completed: true,
                    is_paid: true
                },
                take: 8
            })
            return projects
        } catch (error) {
            throw error
        }
    }
}
