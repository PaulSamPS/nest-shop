import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from '@/modules/order/order.service';
import { CreateOrderDto } from '@/modules/order/dto/createOrder.dto';
import { UserDto } from '@/modules/user/dto/user.dto';
import { JwtAuthGuard } from '@/guards/jwt.guard';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  makePayment(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request: { user: UserDto },
  ) {
    const userId = request.user.id;

    return this.orderService.create(createOrderDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get')
  getAllUserOrders(@Req() request: { user: UserDto }) {
    const userId = request.user.id;

    // return this.orderService.userOrders(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get/:orderId')
  getUserOrder(
    @Req() request: { user: UserDto },
    @Param('orderId') orderId: string,
  ) {
    const userId = request.user.id;

    return this.orderService.getUserOrder(orderId, userId);
  }
}
