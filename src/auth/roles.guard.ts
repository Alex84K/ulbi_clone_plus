import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService, JwtVerifyOptions } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    private secretKey: string = process.env.PRIVATE_KEY;

    constructor(private jwtService: JwtService, private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);

            if (!requiredRoles) {
                return true;
            }

            const req = context.switchToHttp().getRequest();
            const token = req.cookies['token']; // Извлечение токена из cookie

            if (!token) {
                throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
            }

            const secret: JwtVerifyOptions = {
                secret: this.secretKey
            };
            const user = this.jwtService.verify(token, secret);
            req.user = user;
            console.log(user);

            return Array.isArray(user.roles) && user.roles.some(role => requiredRoles.includes(role.value));

        } catch (e) {
            console.log(e);
            throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
        }
    }
}
