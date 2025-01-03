import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseProviders, dbRolesProviders } from './db/database.providers';
import { usersProviders } from './users/users.providers';
import { UsersService } from './users/users.service';
import { DatabaseModule } from './db/DatabaseModule';
import { UsersController } from './users/users.controller';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { RolesService } from './roles/roles.service';
import { RolesController } from './roles/roles.controller';
import { userRolesProviders } from './roles/user-roles.providers';
import { rolesProviders } from './roles/roles.porviders';
import { DatabaseSeederService } from './db/db-seeder.service';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot({
    isGlobal: true, 
  })],
  controllers: [AppController, UsersController, AuthController, RolesController],
  providers: [AppService, UsersService, AuthService, JwtService, RolesService, DatabaseSeederService, ...usersProviders, ...userRolesProviders, ...rolesProviders, ...dbRolesProviders],
  exports: [],
})
export class AppModule {}
