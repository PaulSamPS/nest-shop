import { IsNotEmpty, IsNumber } from 'class-validator';

export class EnterCodeDto {
  @IsNotEmpty()
  readonly phone: string;

  @IsNotEmpty()
  @IsNumber()
  readonly code: number;
}
