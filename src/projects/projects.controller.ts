import { Body, Controller, Get, Param, Post, Req, } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { TaskService } from './task.service';
import { CreateProjectDto, CreateTaskDto } from './dto/create-project';
import { Request } from 'express';

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
}
