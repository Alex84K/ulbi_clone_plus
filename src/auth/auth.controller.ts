import {Body, Controller, Post, Res} from '@nestjs/common';
import { ApiTags} from "@nestjs/swagger";
import { UserCreateDto } from 'src/users/dto/UserCreateDto';
import { AuthService } from './auth.service';
import { Response } from 'express';

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
        // Сбрасываем cookie с токеном
        res.clearCookie('token'); // Убедитесь, что имя cookie совпадает с тем, что вы используете
        return res.status(200).json({ message: 'Вы успешно вышли из системы' });
    }
}