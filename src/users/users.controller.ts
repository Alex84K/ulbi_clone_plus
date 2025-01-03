import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserCreateDto } from './dto/UserCreateDto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { UserResponseDto } from './dto/user-responce.dto';
import { Request } from 'express';

@ApiTags('Users')
@Controller('/api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @ApiOperation({ summary: 'Создание пользователя' })
    @ApiResponse({ status: 200, type: User })
    @Post('')
    createUsers(@Body() userDto: UserCreateDto): Promise<User> {
        return this.usersService.createUser(userDto)
    }

    @ApiOperation({summary: 'Get all users'})
    @ApiResponse({status: 200, type: [User]})
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @Get()
    geAlltUsers(): Promise<UserResponseDto[]> {
        return this.usersService.getAllUsers();
    }

    @ApiOperation({summary: 'Get user by id'})
    @ApiResponse({status: 200, type: [User]})
    @Get('/:id')
    getUserById(@Param('id')id: number): Promise<User> {
        return this.usersService.getUserById(id);
    }
}
