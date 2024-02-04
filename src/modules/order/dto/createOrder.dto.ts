import { IsNotEmpty } from 'class-validator';
import { ProductCartDto } from '@/modules/cart/dto/productCart.dto';
import { ProfileDto } from '@/modules/profile/dto/profile.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  readonly amount: number;
  readonly products: ProductCartDto[];
  readonly userInfo: ProfileDto;
}
