import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Redirect,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthenticatedGuard } from './authenticated.guard';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { UserDto } from '@/modules/user/dto/user.dto';
import * as process from 'process';
import { AppMessage } from '@/common/constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}
  @Post('/registration')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authServices.create(createUserDto);
  }

  @Get('/activate/:activationLink')
  @Redirect(`${process.env.API_URL}/auth/login`)
  @HttpCode(HttpStatus.OK)
  activateUserAccount(@Param('activationLink') activationLink: string) {
    return this.authServices.activateAccount(activationLink);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  login(@Request() req: { user: UserDto }) {
    return { user: req.user, message: AppMessage.LOGGED_IN };
  }

  @Get('/login-check')
  @UseGuards(AuthenticatedGuard)
  loginCheck(@Request() req) {
    return req.user;
  }

  @Get('/logout')
  logout(@Request() req): { message: string } {
    req.session.destroy();
    return { message: AppMessage.SESSION_HAS_ENDED };
  }
}
