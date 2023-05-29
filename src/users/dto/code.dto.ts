import { IsNotEmpty } from 'class-validator';

export class CodeDto {
  @IsNotEmpty()
  readonly phone: string;

  @IsNotEmpty()
  readonly ip: string;
}
