import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Role } from 'src/roles/roles.model';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/user.entity';
import { UserRoles } from 'src/roles/user-roles.model';
import { log } from 'console';

@Injectable()
export class DatabaseSeederService implements OnApplicationBootstrap {
    constructor(
        @Inject('USERS_REPOSITORY')
        private usersRepository: typeof User,
        @Inject('ROLES_REPOSITORY')
        private rolesRepository: typeof Role,
        @Inject('USER_ROLES_REPOSITORY')
        private userRolesRepository: typeof UserRoles
    ) { }

    async onApplicationBootstrap() {
        await this.seedDatabase();
    }

    private async seedDatabase() {
        // Проверяем, существует ли роль "ADMIN"
        const adminRole = await this.rolesRepository.findOne({
            where: { value: 'ADMIN' }
        });

        let adminRoleId;
        if (!adminRole) {
            // Если роль не найдена, создаем ее
            const createdRole = await this.rolesRepository.create({
                value: 'ADMIN',
                description: 'admin'
            }).then( async(data) => {
                const adminUser  = await this.usersRepository.findOne({
                    where: { email: 'admin@admin.com' }
                });
                adminRoleId = data.id
                
                if (!adminUser ) {
                    const hashPassword = await bcrypt.hash('Abc!1234', 5);
                    await this.usersRepository.create({
                        firstName: 'admin',
                        lastName: 'admin',
                        email: 'admin@admin.com',
                        password: hashPassword,
                    }).then(async(data) => await this.userRolesRepository.create({
                        roleId: adminRoleId, // Используем ID роли
                        userId: data.id, // Используем ID созданного пользователя
                    }))
                }
            });
        } 

        const userRole = await this.rolesRepository.findOne({
            where: { value: 'USER' }
        });

        if (!userRole) {
            await this.rolesRepository.create({
                value: 'USER',
                description: 'user'
            });
        } 

        // Проверяем, существует ли роль "OWNER"
        const ownerRole = await this.rolesRepository.findOne({
            where: { value: 'OWNER' }
        });

        if (!ownerRole) {
            const createdOwnerRole = await this.rolesRepository.create({
                value: 'OWNER',
                description: 'owner'
            });
        } 
    }
}
