import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/db/DatabaseModule';
import { UsersService } from './users.service';
import { usersProviders } from './users.providers';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { RolesService } from 'src/roles/roles.service';
import { userRolesProviders } from 'src/roles/user-roles.providers';
import { rolesProviders } from 'src/roles/roles.porviders';

@Module({
  imports: [DatabaseModule, forwardRef(() => AuthModule) ],
  controllers: [UsersController],
  providers: [
    UsersService, AuthService, RolesService,
    ...usersProviders, ...userRolesProviders, ...rolesProviders
  ],
  
})
export class UsersModule {}