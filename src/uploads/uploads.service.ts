import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UploadsService {
    constructor(
        private db: DbService,
    ) { }

    //!TODO implement upload to S3
    async generateSignedUrl(fileName: string) { }

    async create(input: Prisma.UploadCreateInput) {
        try {
            return await this.db.upload.create({
                data: input
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
