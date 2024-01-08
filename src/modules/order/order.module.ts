import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './order.model';
import { UserModule } from '@/modules/user';
import { OrderController } from '@/modules/order/order.controller';
import { PaymentService } from '@/modules/payment/payment.service';

@Module({
  imports: [SequelizeModule.forFeature([Order]), UserModule],
  controllers: [OrderController],
  providers: [OrderService, PaymentService],
  exports: [OrderService],
})
export class OrderModule {}
