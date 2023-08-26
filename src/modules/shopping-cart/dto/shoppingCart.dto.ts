import { ProductCartDto } from '@/modules/shopping-cart/dto/productCart.dto';

export class ShoppingCartDto {
  user: number;
  products: ProductCartDto[];
  total_price: number;
}
