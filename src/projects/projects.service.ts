import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { DbService } from 'src/db/db.service';

@Injectable()
export class ProjectsService {
    constructor(
        private db: DbService,
    ) { }

    async create(input: Prisma.ProjectCreateInput) {
        try {
            const project = await this.db.project.create({ data: input })
            return project
        } catch (error) {
            throw error
        }
    }
}
