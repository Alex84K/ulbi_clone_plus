import {Body, Controller, Get, Post, Req, Res} from '@nestjs/common';
import { ApiTags} from "@nestjs/swagger";
import { UserCreateDto } from 'src/users/dto/UserCreateDto';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { User } from 'src/users/user.entity';
import { UserResponceDto } from 'src/users/types';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    async login(@Body() userDto: UserCreateDto, @Res() response: Response) {
        const { token } = await this.authService.login(userDto);
        response.cookie('token', token, { httpOnly: true }); // Устанавливаем cookie
        return response.send({ message: 'Успешный вход' });
    }

    @Post('/registration')
    async registration(@Body() userDto: UserCreateDto, @Res() response: Response) {
        const { token } = await this.authService.registration(userDto);
        response.cookie('token', token, { httpOnly: true }); // Устанавливаем cookie
        return response.send({ message: 'Успешная регистрация' });
    }

    @Post('logout')
    async logout(@Res() res: Response) {
        this.authService.logout(res)
    }

    @Get('me')
    async me(@Res() res: Response, @Req() req: Request): Promise<UserResponceDto> {
        return this.authService.me(res, req)
    }
}