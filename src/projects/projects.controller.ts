import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { TaskService } from './task.service';
import { CreatePhaseDto, CreateProjectDto, CreateTaskDto, UpdateProjectDetails } from './dto/create-project';
import { Request } from 'express';
import { Prisma } from 'generated/prisma';
import { ProjectQuery } from './dto/db-select';

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
    async adminProjects(
        @Query() query: ProjectQuery
    ) {
        return await this.projectService.allProjectsAdmin(query)
    }

    @Get("/pm")
    async pmProjects(
        @Req() req,
        @Query() query: ProjectQuery
    ) {
        return await this.projectService.allProjectsPM(req.user.id, query)
    }

    @Get("/count")
    async countProjects(
        @Req() req,
    ) {
        //@ts-ignore
        return await this.projectService.projectCounts(req.user.id, req.user.role)
    }

    @Get("/user")
    async getUsersProjects(
        @Req() req,
        @Query() query: ProjectQuery
    ) {
        return await this.projectService.allProjectsUser(req.user.id, query)
    }

    @Get(":id")
    async getOne(
        @Param("id") id: string
    ) {
        return await this.projectService.getSingle(id)
    }

    @Post("task/:taskId/images")
    async addMoreImages(
        @Body() { urls }: { urls: string[] },
        @Param("taskId") taskId: string
    ) {
        return await this.taskService.addMoreTaskImages(taskId, urls)
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

    @Post(":id/verify-phase/:phaseNumber")
    async verifyPhase(
        @Body() dto: { verified: boolean },
        @Param("id") id: string,
        @Param("phaseNumber") phaseNumber: string,
    ) {
        return await this.projectService.verifyPhase(id, parseInt(phaseNumber), dto.verified)
    }

    @Patch("task/:taskId")
    async updateTask(
        @Param("taskId") taskId: string,
        @Body() dto: Prisma.TaskUpdateInput
    ) {

        return await this.taskService.updateTask(taskId, dto)
    }

    @Delete("task-image/:id")
    async deleteTaskImage(
        @Param("id", ParseIntPipe) id: number,
    ) {

        return await this.taskService.deleteTaskImage(id)
    }

    @Delete("task/:taskId")
    async deleteTask(
        @Param("taskId") taskId: string,
    ) {

        return await this.taskService.deleteTask(taskId)
    }

    @Patch(":id")
    async updateProject(
        @Body() dto: UpdateProjectDetails,
        @Param("id") id: string
    ) {

        return await this.projectService.updateProject(id, dto)

    }

}
