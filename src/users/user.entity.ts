
import { DataTypes } from 'sequelize';
import { Table, Column, Model, BelongsToMany } from 'sequelize-typescript';
import { UserCreateDto } from './types';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';

@Table({ tableName: 'users' })

export class User extends Model<User, UserCreateDto> {
    @ApiProperty({example: '1', description: 'Unique id'})
    @Column({type: DataTypes.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'John', description: 'First name'})
    @Column({type: DataTypes.STRING, unique: false, allowNull: false})
    firstName: string;

    @ApiProperty({example: 'Doe', description: 'Last name'})
    @Column({type: DataTypes.STRING, unique: false, allowNull: false})
    lastName: string;

    @ApiProperty({example: 'user@mail.ru', description: 'Email'})
    @Column({type: DataTypes.STRING, unique: true, allowNull: false})
    email: string;

    @ApiProperty({example: '12345678', description: 'Password'})
    @Column({type: DataTypes.STRING, unique: false, allowNull: false})
    password: string;

    @ApiProperty({example: 'true', description: 'Забанен или нет'})
    @Column({type: DataTypes.BOOLEAN, defaultValue: false})
    banned: boolean;

    @ApiProperty({example: 'За хулиганство', description: 'Причина блокировки'})
    @Column({type: DataTypes.STRING, allowNull: true})
    banReason: string;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];
}
