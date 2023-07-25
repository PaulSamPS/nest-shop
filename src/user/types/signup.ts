import { ApiProperty } from '@nestjs/swagger';

export class SignupResponse {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'User' })
  username: string;

  @ApiProperty({ example: '12345' })
  password: string;

  @ApiProperty({ example: '+79123456789' })
  phone: string;

  @ApiProperty({ example: 'email@gmail.com' })
  email: string;

  @ApiProperty({ example: '2023-05-15T17:38:33.499Z' })
  createdAt: string;

  @ApiProperty({ example: '2023-05-15T17:38:33.499Z' })
  updatedAt: string;
}
