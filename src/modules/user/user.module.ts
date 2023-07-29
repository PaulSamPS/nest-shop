import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { MailService } from '@/modules/mail/mail.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, MailService],
  exports: [UserService],
})
export class UserModule {}
