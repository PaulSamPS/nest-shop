import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MakePaymentDto } from './dto/make-payment.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { MakePaymentResponse } from './types';
import { JwtAuthGuard } from '@/guards/jwt.guard';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @ApiOkResponse({ type: MakePaymentResponse })
  @Post('/process')
  makePayment(@Body() makePaymentDto: MakePaymentDto) {
    return this.paymentService.makePayment(makePaymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/status/:paymentId')
  checkPayment(@Param('paymentId') paymentId: string) {
    return this.paymentService.checkPaymentStatus(paymentId);
  }
}
