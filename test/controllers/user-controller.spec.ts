import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig, SequelizeConfigService } from '@config';
import { UserModule, User } from 'users';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';

describe('users controller', () => {
  let app: INestApplication;

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
        UserModule,
      ],
    }).compile();
    app = testModule.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await User.destroy({ where: { username: 'test' } });
  });

  it('should create user', async () => {
    const newUser = {
      username: 'test',
      email: 'test@mail.com',
      password: '12345',
      phone: '+71234567890',
    };

    const response = await request(app.getHttpServer())
      .post('/users/signup')
      .send(newUser);

    const passwordIsValid = await bcrypt.compare(
      newUser.password,
      response.body.password,
    );

    expect(response.body.username).toBe(newUser.username);
    expect(passwordIsValid).toBe(true);
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.phone).toBe(newUser.phone);
  });
});
