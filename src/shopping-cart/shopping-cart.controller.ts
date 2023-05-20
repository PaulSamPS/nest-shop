import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Get(':id')
  getAll(@Param('id') userId: string) {
    return this.shoppingCartService.findAll(userId);
  }

  @Post('/add')
  addToCart(@Body() addToCart: AddToCartDto) {
    return this.shoppingCartService.add(addToCart);
  }
}
