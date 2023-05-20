import { ApiProperty } from '@nestjs/swagger';

export class LoginUserRequest {
  @ApiProperty({ example: 'User' })
  username: string;

  @ApiProperty({ example: '12345' })
  password: string;
}

export class LoginUserResponse {
  @ApiProperty({
    example: {
      userId: 1,
      phone: '+71234567890',
      username: 'user',
      email: 'email@gmail.com',
    },
  })
  user: {
    userId: number;
    username: string;
    phone: string;
    email: string;
  };

  @ApiProperty({ example: 'Logged in' })
  msg: string;
}
