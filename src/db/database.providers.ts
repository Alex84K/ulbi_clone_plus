
import { Sequelize } from 'sequelize-typescript';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';
import { User } from 'src/users/user.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'localhost',
        port: 5433,
        username: 'ulbi',
        password: '1234',
        database: 'ulbi',
      });
      sequelize.addModels([User, UserRoles, Role]);
      await sequelize.sync();
      return sequelize;
    },
  },
];

export const dbRolesProviders = [
  {
    provide: 'DB_ROLES_REPOSITORY',
    useValue: Role,
  },
];
