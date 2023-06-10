import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
} from '@nestjs/common';
import { User } from '@users';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { EnterCodeDto } from '../users/dto/enter-code.dto';
import { AuthService } from '@auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/send-code')
  @HttpCode(HttpStatus.OK)
  async sendCode(
    @Body() createUserDto: CreateUserDto,
    @Ip() ip: string,
  ): Promise<{
    msg: { msg: string } | string;
    createdAt: Date;
    userId: number;
  }> {
    return await this.authService.toSendCode({
      phone: createUserDto.phone,
      ip,
    });
  }

  @Post('/enter-code')
  @HttpCode(HttpStatus.OK)
  async enterCode(
    @Body() enterCode: EnterCodeDto,
    @Ip() ip: string,
  ): Promise<{ user: User; msg: string } | { msg: string; user?: undefined }> {
    return await this.authService.enterCode(enterCode, ip);
  }
}
