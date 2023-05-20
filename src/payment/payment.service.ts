import { ForbiddenException, Injectable } from '@nestjs/common';
import { MakePaymentDto } from './dto/make-payment.dto';
import axios from 'axios';
import uuid from 'uuid';
import * as process from 'process';

@Injectable()
export class PaymentService {
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
          username: process.env.U_KASSA_USERNAME,
          password: process.env.U_KASSA_SECRET_KEY,
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
