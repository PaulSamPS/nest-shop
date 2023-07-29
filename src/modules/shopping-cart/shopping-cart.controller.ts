import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { AddToCartResponse, GetAllResponse } from './types';
import { ShoppingCart } from './shopping-cart.model';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @ApiOkResponse({ type: [GetAllResponse] })
  @Get(':id')
  getAll(@Param('id') userId: number): Promise<ShoppingCart[]> {
    return this.shoppingCartService.findAll(userId);
  }

  @ApiOkResponse({ type: AddToCartResponse })
  @Post('/add')
  addToCart(@Body() addToCart: AddToCartDto): Promise<ShoppingCart> {
    return this.shoppingCartService.add(addToCart);
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
