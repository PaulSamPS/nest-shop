import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from '@/modules/order/order.model';
import { PaymentService } from '@/modules/payment/payment.service';
import { CreateOrderDto } from '@/modules/order/dto/createOrder.dto';
import { CheckOrdersDto } from '@/modules/order/dto/checkOrders.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    private readonly paymentService: PaymentService,
  ) {}
  async create(createOrderDto: CreateOrderDto, userId: number) {
    const payment = await this.paymentService.makePayment(createOrderDto);

    const newOrder = {
      status: payment.status,
      orderId: payment.id,
      products: createOrderDto.products,
      total_price: createOrderDto.amount,
      user: userId,
    };

    await this.orderModel.create(newOrder);

    return payment;
  }

  async userOrders(checkOrdersDto: CheckOrdersDto) {
    // const status = await this.paymentService.checkPaymentStatus(checkOrdersDto);
    // return await this.orderModel.findAll({
    //   where: { user: checkOrdersDto.userId },
    // });
  }

  async getUserOrder(paymentId: string, userId: number) {
    const status = await this.paymentService.checkPaymentStatus(paymentId);
    const order = await this.orderModel.findOne({
      where: { orderId: paymentId, user: userId },
    });

    if (order.status !== 'succeeded') {
      order.status = status.status;
      await order.save();
    }

    return order;
  }
}
