import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '@auth/local-auth.guard';
import { AuthenticatedGuard } from '@auth/authenticated.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from '@auth/auth.service';
import { UserDto } from '../users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authServices.create(createUserDto);
  }

  @Get('/activate/:activationLink')
  @HttpCode(HttpStatus.OK)
  activateUserAccount(@Param('activationLink') activationLink: string) {
    return this.authServices.activateAccount(activationLink);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  login(@Request() req: { user: UserDto }) {
    return { user: req.user, msg: 'Logged in' };
  }

  @Get('/login-check')
  @UseGuards(AuthenticatedGuard)
  loginCheck(@Request() req) {
    return req.user;
  }

  @Get('/logout')
  logout(@Request() req): { msg: string } {
    req.session.destroy();
    return { msg: 'session has ended' };
  }
}
