import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import { UserCreateDto } from 'src/users/dto/UserCreateDto';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
    private secretKey: string = process.env.PRIVATE_KEY;

    constructor(private userService: UsersService,
                private jwtService: JwtService) {}

    async login(userDto: UserCreateDto) {
        const user = await this.validateUser(userDto)
        return this.generateToken(user)
    }

    async logout() {
    }

    async registration(userDto: UserCreateDto):Promise<{ token: string }> {
        const candidate = await this.userService.getUserByEmail(userDto.email);
        if (candidate) {
            throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5);
        const user = await this.userService.createUser({...userDto, password: hashPassword})
        return this.generateToken(user)
    }

    private async generateToken(user: User) {
        const payload = {email: user.email, id: user.id, roles: user.roles}
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
        throw new UnauthorizedException({message: 'Некорректный емайл или пароль'})
    }
}