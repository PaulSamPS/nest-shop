import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

@Injectable()
export class MakePaymentDto {
  @ApiProperty({ example: 100 })
  @IsNotEmpty()
  readonly amount: number;
}

export class MakePaymentResultDto {
  id: string;
  status: string;
  amount: {
    value: string;
    currency: string;
  };
  description: string;
  recipient: {
    account_id: string;
    gateway_id: string;
  };
  created_at: string;
  confirmation: {
    type: string;
    confirmation_url: string;
  };
  test: boolean;
  paid: boolean;
  refundable: boolean;
}
