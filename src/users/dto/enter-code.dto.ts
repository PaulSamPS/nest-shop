import { IsNotEmpty } from 'class-validator';

export class EnterCodeDto {
  @IsNotEmpty()
  readonly phone: string;

  @IsNotEmpty()
  readonly code: number;
}
