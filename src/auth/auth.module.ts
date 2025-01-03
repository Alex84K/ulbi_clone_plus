import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import * as dotenv from 'dotenv';
import { RolesGuard } from './roles.guard';

dotenv.config();

@Module({
    imports: [
        forwardRef(() => UsersModule),
        JwtModule.register({
            global: true,
            secret: process.env.PRIVATE_KEY || 'SECRET', // Убедитесь, что переменная окружения доступна
            signOptions: {
                expiresIn: '24h',
            },
        }),
    ],
    providers: [AuthService, JwtAuthGuard, RolesGuard],
    controllers: [AuthController],
    exports: [JwtModule],
})
export class AuthModule {}
