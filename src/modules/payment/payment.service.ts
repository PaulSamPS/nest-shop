import { ForbiddenException, Injectable } from '@nestjs/common';
import { MakePaymentDto, MakePaymentResultDto } from './dto/make-payment.dto';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import {
  CheckPaymentDto,
  CheckPaymentResultDto,
} from '@/modules/payment/dto/check-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly configService: ConfigService) {}
  async makePayment(
    makePaymentDto: MakePaymentDto,
  ): Promise<MakePaymentResultDto> {
    try {
      const { data } = await axios({
        method: 'POST',
        url: `https://api.yookassa.ru/v3/payments`,
        headers: {
          'Content-Type': 'application/json',
          'Idempotence-Key': uuidv4(),
        },
        auth: {
          username: this.configService.get('u_kassa_username'),
          password: this.configService.get('u_kassa_secret'),
        },
        data: {
          amount: {
            value: makePaymentDto.amount,
            currency: 'RUB',
            payment_id: uuidv4(),
          },
          capture: true,
          confirmation: {
            type: 'redirect',
            return_url: 'http://localhost:3000/order',
          },
          description: 'Тестовый заказ',
        },
      });

      return data;
    } catch (e) {
      throw new ForbiddenException(e);
    }
  }

  async checkPaymentStatus(paymentId: string): Promise<CheckPaymentResultDto> {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `https://api.yookassa.ru/v3/payments/${paymentId}`,
        auth: {
          username: this.configService.get('u_kassa_username'),
          password: this.configService.get('u_kassa_secret'),
        },
      });
      return data;
    } catch (e) {
      throw new ForbiddenException(e);
    }
  }
}
