import { Body, Controller, Delete, Param, Post, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { CreateUploadDto } from './dto/create-upload';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('uploads')
export class UploadsController {
    constructor(
        private uploadService: UploadsService
    ) { }

    @Post('task-image')
    @UseInterceptors(FilesInterceptor('files'))
    uploadTaskImage(
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        return this.uploadService.writeToUploads("images", files)
    }

    @Post("project-files")
    @Post('task-image')
    @UseInterceptors(FilesInterceptor('files'))
    uploadProjectFiles(
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        return this.uploadService.writeToUploads("files", files)
    }

    @Post("/project/:id")
    async createForPhase(
        @Body() dto: CreateUploadDto,
        @Req() req,
        @Param("id") projectId: string
    ) {
        return await this.uploadService.create(projectId, dto, req.user.id)
    }

    @Delete(":id")
    async remove(
        @Param("id") id: string
    ) {
        return await this.uploadService.remove(id)
    }
}
