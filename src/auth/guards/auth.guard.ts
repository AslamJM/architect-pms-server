import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AuthService } from "../auth.service"
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private authService: AuthService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest()
        const sessionId = request.cookies.session_id
        if (!sessionId) {
            throw new UnauthorizedException()
        }

        try {
            const session = await this.authService.verifySession(sessionId)
            request.user = session.user
            return true
        } catch (error) {
            throw new UnauthorizedException('Invalid session ID')
        }
    }
}