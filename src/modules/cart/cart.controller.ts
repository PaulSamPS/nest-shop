import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { AddToCartResponse, GetAllResponse } from './types';
import { Cart } from './cart.model';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { UserDto } from '@/modules/user/dto/user.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [GetAllResponse] })
  @Get('get')
  get(@Req() request: { user: UserDto }): Promise<Cart> {
    const userId: number = request.user.id;

    return this.cartService.get(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: AddToCartResponse })
  @Post('add-product')
  addToCart(
    @Body() addToCart: AddToCartDto,
    @Req() request: { user: UserDto },
  ): Promise<Cart | { message: string }> {
    const userId = request.user.id;

    return this.cartService.add(addToCart, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('increase-count')
  increaseCountAndTotalPrice(
    @Body() addToCart: AddToCartDto,
    @Req() request: { user: UserDto },
  ): Promise<Cart> {
    const userId = request.user.id;

    return this.cartService.increaseCountAndTotalPrice(addToCart, userId);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('decrease-count')
  decreaseCountAndTotalPrice(
    @Body() addToCart: AddToCartDto,
    @Req() request: { user: UserDto },
  ): Promise<Cart> {
    const userId = request.user.id;

    return this.cartService.decreaseCountAndTotalPrice(addToCart, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-product')
  removeOne(
    @Body() id: { productId: number },
    @Req() request: { user: UserDto },
  ) {
    const userId = request.user.id;
    const { productId } = id;

    return this.cartService.remove(productId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-all')
  removeAll(@Req() request: { user: UserDto }): Promise<Cart> {
    const userId = request.user.id;

    return this.cartService.removeAll(userId);
  }
}