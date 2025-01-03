export interface UserCreateDto {
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface UserResponceDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    banned: boolean;
    banReason: string | null;
    createdAt: Date;
    updatedAt: Date;
    roles: UserRoleDto[];
}

export interface UserRoleDto {
    id: number;
    roleId: number;
    userId: number;
}