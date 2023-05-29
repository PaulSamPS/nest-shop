import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: '+791234567890' })
  @IsNotEmpty()
  readonly phone: string;
}
