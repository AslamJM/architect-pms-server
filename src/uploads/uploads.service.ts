import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { DbService } from 'src/db/db.service';
import { CreateUploadDto } from './dto/create-upload';

@Injectable()
export class UploadsService {
    constructor(
        private db: DbService,
    ) { }

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
}
