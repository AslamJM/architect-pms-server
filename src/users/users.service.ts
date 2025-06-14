import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma';
import { DbService } from 'src/db/db.service';
import { hashPassword } from '../utils/auth';

@Injectable()
export class UsersService {
    constructor(
        private db: DbService
    ) { }

    async create(input: Prisma.UserCreateInput) {
        try {
            const hash = await hashPassword(input.password)
            input.password = hash
            const user = await this.db.user.create({ data: input })
            return user
        } catch (error) {
            throw error
        }
    }

    async getAll() {
        try {
            return await this.db.user.findMany()
        } catch (error) {
            throw error
        }
    }

    async updateUser(id: string, input: Prisma.UserUpdateInput) {
        try {
            if (input.password && typeof input.password === "string") {
                const hashed = await hashPassword(input.password)
                input = { ...input, password: hashed }
            }

            await this.db.user.update({
                where: { id },
                data: input
            })

            return { success: true }
        } catch (error) {
            throw error
        }
    }

    async getByUsername(username: string) {
        return await this.db.user.findUnique({ where: { username } })
    }
}
