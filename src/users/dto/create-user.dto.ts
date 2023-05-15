import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: '+791234567890' })
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty({ example: 'Ivan' })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ example: '12345' })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ example: 'email@gmail.com' })
  @IsNotEmpty()
  readonly email: string;
}
