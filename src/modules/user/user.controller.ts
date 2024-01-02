import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userServices: UserService) {}

  @Post('/reset-password')
  resetPassword(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.userServices.sendResetPasswordLink(createUserDto);
  }

  @Get('/check-password-token/:token')
  @HttpCode(HttpStatus.OK)
  checkPassToken(@Param('token') token: string) {
    return this.userServices.checkResetPasswordToken(token);
  }
}
