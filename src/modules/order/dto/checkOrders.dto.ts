import { Injectable } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';

@Injectable()
export class CheckOrdersDto {
  @IsNotEmpty()
  readonly paymentId: string;
  readonly userId: number;
}
