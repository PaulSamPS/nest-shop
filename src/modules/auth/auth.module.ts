import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session.serializer';
import { UserModule } from 'src/modules/user';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { MailService } from '@/modules/mail/mail.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule, PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [AuthService, MailService, LocalStrategy, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule {}
