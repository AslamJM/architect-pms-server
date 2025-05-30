import { Injectable } from '@nestjs/common';
import { Prisma, Role } from 'generated/prisma';
import { DbService } from 'src/db/db.service';
import { CreatePhaseDto, CreateProjectDto, UpdateProjectDetails } from './dto/create-project';
import { allProjecttSelect, parsePage, parseQuery, ProjectQuery } from './dto/db-select';

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

    async findAll(
        where: Prisma.ProjectWhereInput,
        page: number
    ) {
        try {
            const take = 12
            const skip = (page - 1) * take
            const projects = await this.db.project.findMany({
                where,
                take,
                skip,
                select: allProjecttSelect,
                orderBy: { created_at: 'desc' }
            })
            return projects
        } catch (error) {
            throw error
        }
    }

    async allProjectsAdmin(query: ProjectQuery) {
        try {

            const where = parseQuery(query)
            const projects = this.findAll(where, query.page ? parseInt(query.page) : 1)
            return projects
        } catch (error) {
            throw error
        }
    }

    async allProjectsPM(userId: string, query: ProjectQuery) {
        try {
            const where = parseQuery(query)
            const projects = this.findAll({
                ...where,
                assigned_by: { id: userId }
            }, query.page ? parseInt(query.page) : 1)
            return projects
        } catch (error) {
            throw error
        }
    }

    async allProjectsUser(userId: string, query: ProjectQuery) {
        try {

            const where = parseQuery(query)
            const projects = this.findAll({
                ...where,
                assigned_to: { id: userId }
            }, query.page ? parseInt(query.page) : 1)
            return projects

        } catch (error) {
            throw error
        }
    }

    async createProjectPhase(projectId: string, dto: CreatePhaseDto, userId: string) {
        try {
            const { phase_number, upload_urls } = dto
            const created = await this.db.phase.create({
                data: {
                    phase_number,
                    project: { connect: { id: projectId } },
                    uploads: {
                        createMany: {
                            data: upload_urls.map(url => ({
                                type: "UPLOADED_FILES",
                                url,
                                uploaded_by_id: userId
                            }))
                        }
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
                            type: true,
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
                                    id: true,
                                    type: true,
                                    url: true,
                                    uploaded_at: true
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


    async updateProject(id: string, data: UpdateProjectDetails) {
        try {
            await this.db.project.update({
                where: { id },
                data
            })
            return { success: true }
        } catch (error) {
            throw error
        }
    }

    // async verify phase 
    async verifyPhase(projectId: string, phaseNumber: number, verified: boolean) {
        try {
            await this.db.phase.update({
                where: {
                    project_id_phase_number: {
                        project_id: projectId,
                        phase_number: phaseNumber
                    }
                },
                data: { verified }
            })
            return { success: true }
        } catch (error) {
            throw error
        }
    }

    async projectCounts(userId: string, role: Role) {
        try {
            const where: Prisma.ProjectWhereInput = {}
            if (role === Role.PROJECT_MANAGER) {
                where.assigned_by = { id: userId }
            } else if (role === Role.USER) {
                where.assigned_to = { id: userId }
            }

            return await this.db.project.count({
                where
            })
        } catch (error) {
            throw error
        }
    }

}
