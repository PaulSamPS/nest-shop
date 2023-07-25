import { INestApplication } from '@nestjs/common';
import { AuthService } from '../../src/auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig, SequelizeConfigService } from '@config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@auth';
import { User } from 'users';
import * as bcrypt from 'bcrypt';

const mockedUser = {
  username: 'test',
  email: 'test@mail.com',
  password: '12345',
  phone: '+71234567890',
};

describe('auth Service', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          useClass: SequelizeConfigService,
        }),
        ConfigModule.forRoot({
          load: [databaseConfig],
        }),
        AuthModule,
      ],
    }).compile();

    authService = testModule.get<AuthService>(AuthService);
    app = testModule.createNestApplication();

    await app.init();
  });

  beforeEach(async () => {
    const user = new User();

    const hashedPassword = await bcrypt.hash(mockedUser.password, 10);

    user.username = mockedUser.username;
    user.password = hashedPassword;
    user.email = mockedUser.email;

    return user.save();
  });

  afterEach(async () => {
    await User.destroy({ where: { username: mockedUser.username } });
  });

  it('should login user', async () => {
    const user = await authService.validateUser(
      mockedUser.username,
      mockedUser.password,
    );

    expect(user.username).toBe(mockedUser.username);
    expect(user.email).toBe(mockedUser.email);
  });
});
