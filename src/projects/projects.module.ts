import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TaskService } from './task.service';

@Module({
  providers: [ProjectsService, TaskService],
  controllers: [ProjectsController]
})
export class ProjectsModule { }
