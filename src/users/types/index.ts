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

export class LogoutUserResponse {
  @ApiProperty({ example: 'Session has ended' })
  msg: string;
}

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
