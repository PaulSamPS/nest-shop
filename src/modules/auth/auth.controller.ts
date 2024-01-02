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
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import * as process from 'process';
import { AppMessage } from '@/common/constants/appMessage';
import { TokenService } from '@/modules/token/token.service';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { AuthUserDto } from '@/modules/auth/dto/authUserDto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authServices: AuthService,
    private readonly tokenService: TokenService,
  ) {}
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authServices.create(createUserDto);
  }

  @Get('activate/:activationLink')
  @Redirect(`${process.env.API_URL}/auth/login`)
  @HttpCode(HttpStatus.OK)
  activateUserAccount(@Param('activationLink') activationLink: string) {
    return this.authServices.activateAccount(activationLink);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  login(@Body() authUserDto: AuthUserDto) {
    console.log(authUserDto);
    return this.authServices.login(authUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('check')
  check() {
    return true;
  }

  @Get('/logout')
  logout(@Request() req): { message: string } {
    req.session.destroy();
    return { message: AppMessage.SESSION_HAS_ENDED };
  }
}
