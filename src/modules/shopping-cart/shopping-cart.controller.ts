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
  @Post('add-product')
  addToCart(
    @Body() addToCart: AddToCartDto,
    @Req() request,
  ): Promise<ShoppingCart | { message: string }> {
    const userId = request.user.id;

    return this.shoppingCartService.add(addToCart, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('increase-count')
  increaseCountAndTotalPrice(
    @Body() addToCart: AddToCartDto,
    @Req() request,
  ): Promise<ShoppingCart> {
    const userId = request.user.id;

    return this.shoppingCartService.increaseCountAndTotalPrice(
      addToCart,
      userId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Patch('decrease-count')
  decreaseCountAndTotalPrice(
    @Body() addToCart: AddToCartDto,
    @Req() request,
  ): Promise<ShoppingCart> {
    const userId = request.user.id;

    return this.shoppingCartService.decreaseCountAndTotalPrice(
      addToCart,
      userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-product/:id')
  removeOne(@Param('id') id, @Req() request) {
    console.log(Number(id));
    const userId = request.user.id;

    return this.shoppingCartService.remove(Number(id), userId);
  }
  //
  // @Delete('remove-all/:id')
  // removeAll(@Param('id') userId: number): Promise<void> {
  //   return this.shoppingCartService.removeAll(userId);
  // }
}
