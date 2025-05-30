import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import { CreateTaskDto } from "./dto/create-project";
import { Prisma } from "generated/prisma";
import { taskSelect } from "./dto/db-select";

@Injectable()
export class TaskService {
    constructor(
        private db: DbService,
    ) { }

    async addTaskToProject(projectId: string, dto: CreateTaskDto) {
        try {
            const { content, type, image_urls, completed } = dto
            const input: Prisma.TaskCreateInput = {
                content,
                type,
                project: { connect: { id: projectId } },
                images: { create: image_urls.map(iu => ({ url: iu })) },
                completed
            }

            const task = await this.db.task.create({
                data: input,
                select: taskSelect
            })

            return { ...task, images: task.images.map(im => im.url) }

        } catch (error) {
            throw error
        }
    }

    async updateTask(taskId: string, update: Prisma.TaskUpdateInput) {
        try {
            await this.db.task.update({
                where: { id: taskId },
                data: update
            })

            return {
                success: true
            }

        } catch (error) {
            throw error
        }
    }

    async deleteTask(id: string) {
        try {
            await this.db.task.delete({ where: { id } })
            return { success: true }
        } catch (error) {
            throw error
        }
    }

    async deleteTaskImage(id: number) {
        try {
            await this.db.taskImage.delete({ where: { id } })
            return { success: true }
        } catch (error) {
            throw error
        }
    }
}