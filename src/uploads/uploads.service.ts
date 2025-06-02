import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { DbService } from 'src/db/db.service';
import { CreateUploadDto } from './dto/create-upload';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { recentUploadsSelect } from './dto/query';

const uploadDir = join(process.cwd(), 'uploads')

@Injectable()
export class UploadsService {
    constructor(
        private db: DbService,
    ) { }

    //mock write to uploads dir . 
    async writeToUploads(dir: string, files: Array<Express.Multer.File>) {
        for (const f of files) {
            await writeFile(uploadDir + `/${dir}/${f.originalname}`, f.buffer)
        }

        return files.map(f => `http://localhost:3000/uploads/${dir}/${f.originalname}`)
    }

    //!TODO implement upload to S3
    async generateSignedUrl(fileName: string) { }

    async create(projectId: string, input: CreateUploadDto, userId: string) {
        try {

            const { phase_number, type, url } = input

            return await this.db.upload.create({
                data: {
                    uploaded_by_id: userId,
                    project_id: projectId,
                    phase_number,
                    type,
                    url
                },
                select: {
                    id: true,
                    type: true,
                    url: true,
                    uploaded_at: true
                }
            })
        } catch (error) {
            throw error
        }
    }

    async createTaskImage(input: Prisma.TaskImageCreateInput) {
        try {
            return await this.db.taskImage.create({
                data: input
            })
        } catch (error) {
            throw error
        }
    }

    async remove(id: string) {
        try {
            await this.db.upload.delete({ where: { id } })
            // delete also from cloud storage
            return { success: true }
        } catch (error) {
            throw error
        }
    }

    async getRecentUploadsForAdmin() {
        const uploads = await this.db.upload.findMany({
            where: {
                type: { not: "UPLOADED_FILES" }
            },
            select: recentUploadsSelect,
            take: 5,
            orderBy: {
                uploaded_at: "desc"
            }
        })

        return uploads.map(up => ({
            project_id: up.phase.project.id,
            project_name: up.phase.project.name,
            uploaded_by: up.uploaded_by.name,
            uploaded_at: up.uploaded_at,
            type: up.type
        }))
    }

    async getRecentUploadsForPM(userId: string) {
        const uploads = await this.db.upload.findMany({
            where: {
                type: { not: "UPLOADED_FILES" },
                phase: {
                    project: {
                        assigned_by_id: userId
                    }
                },
            },
            select: recentUploadsSelect,
            take: 5,
            orderBy: {
                uploaded_at: "desc"
            }
        })

        return uploads.map(up => ({
            project_id: up.phase.project.id,
            project_name: up.phase.project.name,
            uploaded_by: up.uploaded_by.name,
            uploaded_at: up.uploaded_at,
            type: up.type
        }))
    }
}
