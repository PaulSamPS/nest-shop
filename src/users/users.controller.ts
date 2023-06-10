import { Controller, Get, Request } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { LogoutUserResponse } from './types';

@Controller('users')
export class UsersController {
  @ApiOkResponse({ type: LogoutUserResponse })
  @Get('/logout')
  logout(@Request() req): { msg: string } {
    req.session.destroy();
    return { msg: 'session has ended' };
  }
}
