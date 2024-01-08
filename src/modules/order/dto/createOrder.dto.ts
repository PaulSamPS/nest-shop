import { IsNotEmpty } from 'class-validator';
import { ProductCartDto } from '@/modules/cart/dto/productCart.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  readonly amount: number;
  readonly products: ProductCartDto[];
}
