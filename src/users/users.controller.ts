import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from 'generated/prisma';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService
    ) { }

    @Get('')
    async getAll() {
        return await this.userService.getAll()
    }

    @Post('')
    async create(
        @Body() input: Prisma.UserCreateInput
    ) {
        return await this.userService.create(input)
    }
}
