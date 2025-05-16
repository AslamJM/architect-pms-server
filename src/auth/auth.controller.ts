import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from './guards/auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('sign-in')
    async signIn(
        @Body() dto: SignInDto,
        @Res({ passthrough: true }) res: Response
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

    @UseGuards(AuthGuard)
    @Get('profile')
    async verifySession(@Req() req) {
        try {
            return req.user
        } catch (error) {
            throw error
        }
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        try {
            const sessionId = req.cookies.session_id

            await this.authService.logout(sessionId)
            res.clearCookie("session_id")
            return {
                success: true
            }
        } catch (error) {
            throw error
        }
    }
}
