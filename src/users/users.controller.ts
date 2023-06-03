import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthenticatedGuard } from '@auth/authenticated.guard';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
  LoginCheckResponse,
  LoginUserRequest,
  LoginUserResponse,
  LogoutUserResponse,
} from './types';
import { LocalAuthGuard } from '@auth/local-auth.guard';
import { EnterCodeDto } from './dto/enter-code.dto';
import { User } from './users.model';

@Controller('users')
export class UsersController {
  constructor(private readonly userServices: UsersService) {}

  @ApiBody({ type: LoginUserRequest })
  @ApiOkResponse({ type: LoginUserResponse })
  @Post('/send-code')
  // @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async sendCode(
    @Body() createUserDto: CreateUserDto,
    @Ip() ip: string,
  ): Promise<{ msg: string }> {
    const phone: string = await this.userServices.create(createUserDto);
    return await this.userServices.toSendCode({ phone, ip });
  }

  @Post('/enter-code')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async enterCode(
    @Body() enterCode: EnterCodeDto,
    @Ip() ip: string,
  ): Promise<{ user: User; msg: string } | { msg: string; user?: undefined }> {
    return await this.userServices.enterCode(enterCode, ip);
  }

  @ApiOkResponse({ type: LoginCheckResponse })
  @Get('/login-check')
  @UseGuards(AuthenticatedGuard)
  loginCheck(@Request() req) {
    return req.user;
  }

  @ApiOkResponse({ type: LogoutUserResponse })
  @Get('/logout')
  logout(@Request() req): { msg: string } {
    req.session.destroy();
    return { msg: 'session has ended' };
  }
}
