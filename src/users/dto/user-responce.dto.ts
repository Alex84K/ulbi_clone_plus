// user-response.dto.ts
import { Expose, Type } from 'class-transformer';
import { UserRoleDto } from 'src/roles/dto/user-role.dto';

export class UserResponseDto {
    @Expose()
    id: number;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    email: string;

    @Expose()
    banned: boolean;

    @Expose()
    banReason: string | null;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    @Type(() => UserRoleDto) // Указываем, что roles - это массив UserRoleDto
    roles: UserRoleDto[];

    constructor(user: any) { // Замените 'any' на ваш тип пользователя
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.banned = user.banned
        this.banReason = user.banReason;
        this.roles = user.roles.map(role => new UserRoleDto(role)); // Преобразуем роли
    }
}