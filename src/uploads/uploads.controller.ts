import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { CreateUploadDto } from './dto/create-upload';

@Controller('uploads')
export class UploadsController {
    constructor(
        private uploadService: UploadsService
    ) { }

    @Post("/project/:id")
    async createForPhase(
        @Body() dto: CreateUploadDto,
        @Req() req,
        @Param("id") projectId: string
    ) {
        return await this.uploadService.create(projectId, dto, req.user.id)
    }
}
