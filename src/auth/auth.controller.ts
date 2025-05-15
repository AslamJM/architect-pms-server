import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('sign-in')
    async signIn(
        @Body() dto: SignInDto,
        @Res({ passthrough: true }) res
    ) {
        try {
            const { session_id, user } = await this.authService.signIn(dto)
            res.cookie('session_id', session_id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            })
            return user
        } catch (error) {
            throw error
        }
    }

    @Get('verify-session')
    async verifySession(@Res() res) {
        const sessionId = res.cookies.session_id
        return this.authService.verifySession(sessionId)
    }
}
