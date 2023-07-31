import { ForbiddenException, Injectable } from '@nestjs/common';
import { MakePaymentDto } from './dto/make-payment.dto';
import axios from 'axios';
import uuid from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(private readonly configService: ConfigService) {}
  async makePayment(makePaymentDto: MakePaymentDto) {
    try {
      const { data } = await axios({
        method: 'POST',
        url: 'https://api.yookassa.ru/v3/payments',
        headers: {
          'Content-Type': 'application/json',
          'Idempotence-Key': uuid.v4(),
        },
        auth: {
          username: this.configService.get('u_kassa_username'),
          password: this.configService.get('u_kassa_secret'),
        },
        data: {
          amount: {
            value: makePaymentDto.amount,
            currency: 'RUB',
          },
          capture: true,
          confirmation: {
            type: 'redirect',
            return_url: 'http://localhost:3001/order',
          },
          description: 'Тестовый заказ',
        },
      });
      return data;
    } catch (e) {
      throw new ForbiddenException(e);
    }
  }
}
