import { Body, Controller, Get, Param, Patch, Post, Req, } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { TaskService } from './task.service';
import { CreatePhaseDto, CreateProjectDto, CreateTaskDto, UpdateProjectDetails } from './dto/create-project';
import { Request } from 'express';
import { Prisma } from 'generated/prisma';

@Controller('projects')
export class ProjectsController {
    constructor(
        private projectService: ProjectsService,
        private taskService: TaskService
    ) { }

    @Post("")
    async createProject(
        @Body() dto: CreateProjectDto,
        @Req() req: Request
    ) {
        //!TODO fix express type to resolve req.user
        //@ts-ignore
        return await this.projectService.create(dto, req.user.id)
    }

    @Get("/admin")
    async adminProjects() {
        return await this.projectService.allProjectsAdmin()
    }

    @Get("/user")
    async getUsersProjects(
        @Req() req
    ) {
        return await this.projectService.allProjectsUser(req.user.id)
    }

    @Get(":id")
    async getOne(
        @Param("id") id: string
    ) {
        return await this.projectService.getSingle(id)
    }

    @Post(":id/task")
    async addTaskToProject(
        @Body() dto: CreateTaskDto,
        @Param("id") id: string
    ) {
        return await this.taskService.addTaskToProject(id, dto)
    }

    @Post(":id/phase")
    async addPhaseProject(
        @Body() dto: CreatePhaseDto,
        @Param("id") id: string,
        @Req() req: Request
    ) {
        //@ts-ignore
        return await this.projectService.createProjectPhase(id, dto, req.user.id)
    }
    @Patch("task/:taskId")
    async updateTask(
        @Param("taskId") taskId: string,
        @Body() dto: Prisma.TaskUpdateInput
    ) {

        return await this.projectService.updateTask(taskId, dto)
    }

    @Patch(":id")
    async updateProject(
        @Body() dto: UpdateProjectDetails,
        @Param("id") id: string
    ) {

        return await this.projectService.updateProject(id, dto)

    }

}
