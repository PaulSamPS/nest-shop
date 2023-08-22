import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { AddToCartResponse, GetAllResponse } from './types';
import { ShoppingCart } from './shopping-cart.model';
import { JwtAuthGuard } from '@/guards/jwt.guard';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @ApiOkResponse({ type: [GetAllResponse] })
  @Get('get')
  getAll(@Req() request): Promise<ShoppingCart> {
    const userId = request.user.id;

    return this.shoppingCartService.get(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: AddToCartResponse })
  @Post('/add')
  addToCart(
    @Body() addToCart: AddToCartDto,
    @Req() request,
  ): Promise<ShoppingCart> {
    const userId = request.user.id;

    return this.shoppingCartService.add(addToCart, userId);
  }

  @Patch('/count/increase/:id')
  increaseCountAndTotalPrice(
    @Param('id') productId: number,
  ): Promise<{ count: number; total_price: number }> {
    return this.shoppingCartService.increaseCountAndTotalPrice(productId);
  }

  @Patch('/count/decrease/:id')
  decreaseCountAndTotalPrice(
    @Param('id') productId: number,
  ): Promise<{ count: number; total_price: number } | { msg: string }> {
    return this.shoppingCartService.decreaseCountAndTotalPrice(productId);
  }

  @Delete('remove-one/:id')
  removeOne(@Param('id') productId: number): Promise<void> {
    return this.shoppingCartService.remove(productId);
  }

  @Delete('remove-all/:id')
  removeAll(@Param('id') userId: number): Promise<void> {
    return this.shoppingCartService.removeAll(userId);
  }
}
