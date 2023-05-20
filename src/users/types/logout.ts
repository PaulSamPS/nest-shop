import { ApiProperty } from '@nestjs/swagger';

export class LogoutUserResponse {
  @ApiProperty({ example: 'Session has ended' })
  msg: string;
}
