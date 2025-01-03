import { Expose } from 'class-transformer';

export class UserRoleDto {
    @Expose()
    id: number;

    @Expose()
    value: string;

    @Expose()
    description: string;


    constructor(role: any) { // Замените 'any' на ваш тип пользователя
        this.id = role.id;
        this.value = role.value;
        this.description = role.description;
    }
}