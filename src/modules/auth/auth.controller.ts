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
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import * as process from 'process';
import { AppMessage } from '@/common/constants/appMessage';
import { TokenService } from '@/modules/token/token.service';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { AuthUserDto } from '@/modules/auth/dto/authUserDto';
import { Response } from 'express';
import { UserDto } from '@/modules/user/dto/user.dto';

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
  async login(
    @Body() authUserDto: AuthUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { message, token, user } = await this.authServices.login(authUserDto);
    res.cookie('auth', token, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: false,
    });

    return { user, message };
  }

  @UseGuards(JwtAuthGuard)
  @Post('check')
  async check(
    @Res({ passthrough: true }) res: Response,
    @Req() request: { user: UserDto },
  ) {
    try {
      const user = request.user;
      await this.tokenService.generateJwtToken(user);
      return user;
    } catch (e) {
      return false;
    }
  }

  @Get('/logout')
  logout(@Res({ passthrough: true }) res: Response): { message: string } {
    res.clearCookie('auth', {
      httpOnly: true,
      secure: false,
    });
    return { message: AppMessage.SESSION_HAS_ENDED };
  }
}
