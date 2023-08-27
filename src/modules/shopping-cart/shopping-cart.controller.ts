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
import { ShoppingCartService } from './shopping-cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { AddToCartResponse, GetAllResponse } from './types';
import { ShoppingCart } from './shopping-cart.model';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { UserDto } from '@/modules/user/dto/user.dto';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @ApiOkResponse({ type: [GetAllResponse] })
  @Get('get')
  getAll(@Req() request: { user: UserDto }): Promise<ShoppingCart> {
    const userId: number = request.user.id;

    return this.shoppingCartService.get(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: AddToCartResponse })
  @Post('add-product')
  addToCart(
    @Body() addToCart: AddToCartDto,
    @Req() request: { user: UserDto },
  ): Promise<ShoppingCart | { message: string }> {
    const userId = request.user.id;

    return this.shoppingCartService.add(addToCart, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('increase-count')
  increaseCountAndTotalPrice(
    @Body() addToCart: AddToCartDto,
    @Req() request: { user: UserDto },
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
    @Req() request: { user: UserDto },
  ): Promise<ShoppingCart> {
    const userId = request.user.id;

    return this.shoppingCartService.decreaseCountAndTotalPrice(
      addToCart,
      userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-product')
  removeOne(
    @Body() id: { productId: number },
    @Req() request: { user: UserDto },
  ) {
    const userId = request.user.id;
    const { productId } = id;

    return this.shoppingCartService.remove(productId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-all')
  removeAll(@Req() request: { user: UserDto }): Promise<ShoppingCart> {
    const userId = request.user.id;

    return this.shoppingCartService.removeAll(userId);
  }
}
