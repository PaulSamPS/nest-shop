import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

@Injectable()
export class MakePaymentDto {
  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  readonly amount: number;
}
