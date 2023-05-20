import { ApiProperty } from '@nestjs/swagger';

export class LoginCheckResponse {
  @ApiProperty({ example: 'User' })
  username: string;

  @ApiProperty({ example: '12345' })
  password: string;

  @ApiProperty({ example: '+79123456789' })
  phone: string;

  @ApiProperty({ example: 'email@gmail.com' })
  email: string;
}
