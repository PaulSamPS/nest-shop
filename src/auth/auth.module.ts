import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@users';
import { Code } from '../users/code.model';
import { IpAddress } from '../users/ip-address.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Code, IpAddress])],
  providers: [AuthService, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
