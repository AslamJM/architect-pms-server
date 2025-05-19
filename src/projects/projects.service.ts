import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { DbService } from 'src/db/db.service';
import { CreatePhaseDto, CreateProjectDto } from './dto/create-project';
import { allProjecttSelect } from './dto/db-select';

@Injectable()
export class ProjectsService {
    constructor(
        private db: DbService,
    ) { }

    async create(dto: CreateProjectDto, userId: string) {
        try {
            const { name, description, design_notes, assigned_to_id } = dto
            const input: Prisma.ProjectCreateInput = {
                name,
                description,
                design_notes,
                assigned_to: {
                    connect: { id: assigned_to_id }
                },
                assigned_by: {
                    connect: { id: userId }
                }
            }
            const project = await this.db.project.create({
                data: input
            })
            return project
        } catch (error) {
            throw error
        }
    }

    async allProjectsAdmin() {
        try {
            const projects = await this.db.project.findMany({
                select: allProjecttSelect
            })
            return projects
        } catch (error) {
            throw error
        }
    }

    async allProjectPM(userId: string) {
        try {
            const projects = await this.db.project.findMany({
                where: { assigned_by_id: userId },
                select: allProjecttSelect
            })
            return projects
        } catch (error) {
            throw error
        }
    }

    async createProjectPhase(projectId: string, dto: CreatePhaseDto) {
        try {
            const { phase_number, upload_ids } = dto
            const created = await this.db.phase.create({
                data: {
                    phase_number,
                    project: { connect: { id: projectId } },
                    uploads: {
                        connect: upload_ids.map(id => ({ id }))
                    }
                }
            })

            return created

        } catch (error) {
            throw error
        }
    }

    // get single project 
    // for both admin and user 
    async getSingle(id: string) {
        try {
            const project = await this.db.project.findFirstOrThrow({
                where: { id },
                select: {
                    id: true,
                    description: true,
                    design_notes: true,
                    is_completed: true,
                    is_paid: true,
                    name: true,
                    created_at: true,
                    assigned_to: {
                        select: { name: true, id: true }
                    },
                    assigned_by: {
                        select: { name: true, id: true }
                    },
                    tasks: {
                        select: {
                            id: true,
                            type:true,
                            content: true,
                            completed: true,
                            images: {
                                select: { id: true, url: true }
                            }
                        }
                    },
                    phases: {
                        select: {
                            phase_number: true,
                            verified: true,
                            uploads: {
                                select: {
                                    type: true,
                                    url: true
                                }
                            }
                        }
                    }
                }
            })
            return project
        } catch (error) {
            throw error
        }
    }


}
