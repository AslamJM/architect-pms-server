import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in';
import { UsersService } from 'src/users/users.service';
import { expiryAt, verifyPassword } from 'src/utils/authauth';
import { DbService } from 'src/db/db.service';

@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService,
        private db: DbService
    ) { }

    async signIn(dto: SignInDto) {
        try {
            const { username, password } = dto
            const user = await this.userService.getByUsername(username)
            if (!user || !await verifyPassword(password, user.password)) {
                throw new UnauthorizedException()
            }

            const session = await this.createSession(user.id)
            const { name, role, id } = user
            return {
                session_id: session.id,
                user: { id, name, role }
            }

        } catch (error) {
            throw error
        }
    }

    async createSession(userId: string) {
        try {
            const exp = expiryAt(new Date())
            const session = await this.db.session.create({
                data: { user_id: userId, exp_at: exp }
            })
            return session
        } catch (error) {
            throw error
        }
    }

    async verifySession(id: string) {
        try {
            const session = await this.db.session.findUnique({
                where: { id },
                include: { user: true }
            })
            if (!session || !session.user || !session.user.status) {
                throw new UnauthorizedException()
            }

            const now = new Date()
            if (session.exp_at < now) {
                await this.db.session.delete({ where: { id } })
                throw new UnauthorizedException()
            }

            const user = session.user
            const { name, role, id: userId } = user
            return {
                user: { id: userId, name, role }
            }

        } catch (error) {
            throw error
        }
    }
}
