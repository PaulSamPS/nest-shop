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
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import {
  AddToCartResponse,
  GetAllResponse,
  UpdateCountRequest,
  UpdateCountResponse,
  UpdateTotalPriceRequest,
  UpdateTotalPriceResponse,
} from './types';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @ApiOkResponse({ type: [GetAllResponse] })
  @Get(':id')
  getAll(@Param('id') userId: number) {
    return this.shoppingCartService.findAll(userId);
  }

  @ApiOkResponse({ type: AddToCartResponse })
  @Post('/add')
  addToCart(@Body() addToCart: AddToCartDto) {
    return this.shoppingCartService.add(addToCart);
  }

  @ApiOkResponse({ type: UpdateCountResponse })
  @ApiBody({ type: UpdateCountRequest })
  @Patch('/count/:id')
  updateCount(
    @Body() { count }: { count: number },
    @Param('id') productId: number,
  ) {
    return this.shoppingCartService.updateCount(count, productId);
  }

  @ApiOkResponse({ type: UpdateTotalPriceResponse })
  @ApiBody({ type: UpdateTotalPriceRequest })
  @Patch('/total-price/:id')
  updateTotalPrice(
    @Body() { total_price }: { total_price: number },
    @Param('id') productId: number,
  ) {
    return this.shoppingCartService.updateTotalPrice(total_price, productId);
  }

  @Delete('remove-one/:id')
  removeOne(@Param('id') productId: number) {
    return this.shoppingCartService.remove(productId);
  }

  @Delete('remove-all/:id')
  removeAll(@Param('id') userId: number) {
    return this.shoppingCartService.removeAll(userId);
  }
}
