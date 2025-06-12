import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
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

    @Patch(":id")
    async update(
        @Body() input: Prisma.UserUpdateInput,
        @Param("id") id: string
    ) {
        return await this.userService.updateUser(id, input)
    }
}
