import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './user.entity';
import { UserCreateDto } from './dto/UserCreateDto';
import { RolesService } from 'src/roles/roles.service';
import { BanUserDto } from './dto/ban-user.dto';
import { UserResponseDto } from './dto/user-responce.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: typeof User,
    private roleService: RolesService
  ) { }

  async createUser(dto: UserCreateDto) {
    const user = await this.usersRepository.create(dto)
    const role = await this.roleService.getRoleByValue("USER")
    await user.$set('roles', [role.id])
    user.roles = [role]
    return user;
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.findAll({ include: { all: true } });
    return users.map(user => new UserResponseDto(user));
}

async getUserById(id: number): Promise<User> {
  const user = await this.usersRepository.findOne({ where: { id }, include: { all: true } })
  return user;
}

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email }, include: { all: true } })
    return user;
  }

  async addRole(dto: string) {
    const user = await this.usersRepository.findByPk(dto);
    return dto;
  }

  async ban(dto: BanUserDto) {
    const user = await this.usersRepository.findByPk(dto.userId);
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    user.banned = true;
    user.banReason = dto.banReason;
    await user.save();
    return user;
  }
}