import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/user';
import { MailService } from '@/modules/mail/mail.service';
import { AuthController } from './auth.controller';
import { TokenModule } from '@/modules/token/token.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, MailService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
