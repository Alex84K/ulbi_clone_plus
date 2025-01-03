import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import { UserCreateDto } from 'src/users/dto/UserCreateDto';
import { User } from 'src/users/user.entity';
import { Response, Request } from 'express';
import { UserResponseDto } from 'src/users/dto/user-responce.dto';
import { UserResponceDto } from 'src/users/types';

@Injectable()
export class AuthService {
    private secretKey: string = process.env.PRIVATE_KEY;

    constructor(private userService: UsersService,
        private jwtService: JwtService,) { }

    async login(userDto: UserCreateDto) {
        const user = await this.validateUser(userDto)
        return this.generateToken(user)
    }

    async me(res: any, req: Request): Promise<UserResponceDto> {
        try {
            const token = req.cookies.token;

            if (!token) {
                return res.status(403).json({ message: 'Problems with token' });
            }

            // Проверяем и декодируем токен
            const decoded = this.jwtService.decode(token) as { id: number };

            if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
                return res.status(403).json({ message: 'Problems with token' });
            }

            const userId = Number(decoded.id);

            if (isNaN(userId)) {
                return res.status(403).json({ message: 'Problems with token' });
            }

            const user = await this.userService.getUserById(userId)
            const userResp = new UserResponseDto(user)

            if (!user) {
                return null;
            }

            return res.status(200).json(userResp);
        } catch (error) {
            return res.status(500).json({ message: `Error: ${error}` });
        }
    }

    async logout(res: Response) {
        // Сбрасываем cookie с токеном
        res.clearCookie('token'); // Убедитесь, что имя cookie совпадает с тем, что вы используете
        return res.status(200).json({ message: 'Вы успешно вышли из системы' });
    }

    async registration(userDto: UserCreateDto): Promise<{ token: string }> {
        const candidate = await this.userService.getUserByEmail(userDto.email);
        if (candidate) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({ ...userDto, password: hashPassword })
        return this.generateToken(user)
    }

    private async generateToken(user: User) {
        const payload = { email: user.email, id: user.id, roles: user.roles }
        return {
            token: this.jwtService.sign(payload, { secret: this.secretKey })
        }
    }

    private async validateUser(userDto: UserCreateDto) {
        const user = await this.userService.getUserByEmail(userDto.email);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({ message: 'Некорректный емайл или пароль' })
    }
}