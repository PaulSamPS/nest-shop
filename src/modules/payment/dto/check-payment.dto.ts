import { Injectable } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';

@Injectable()
export class CheckPaymentDto {
  @IsNotEmpty()
  readonly paymentId: string;
}

export class CheckPaymentResultDto {
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
