import {ApiProperty} from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class UserCreateDto {
    @ApiProperty({example: 'Peter', description: 'First name'})
    readonly firstName: string;

    @ApiProperty({example: 'Grot', description: 'Last name'})
    readonly lastName: string;

    @ApiProperty({example: 'user@mail.ru', description: 'Почта'})
    @IsString({message: 'Должно быть строкой'})
    @IsEmail({}, {message: "Некорректный email"})
    readonly email: string;
    @ApiProperty({example: '12345', description: 'пароль'})
    @IsString({message: 'Должно быть строкой'})
    @Length(4, 16, {message: 'Не меньше 4 и не больше 16'})
    readonly password: string;
}