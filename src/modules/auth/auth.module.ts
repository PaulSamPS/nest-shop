import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/user';
import { MailService } from '@/modules/mail/mail.service';
import { AuthController } from './auth.controller';
import { TokenModule } from '@/modules/token/token.module';
import { JwtStrategy } from '@/strategy';

@Module({
  imports: [UserModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, MailService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
