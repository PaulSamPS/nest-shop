import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  readonly price: number;

  readonly oldPrice: number;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly images: string;

  @IsNotEmpty()
  readonly in_stock: number;

  @IsNotEmpty()
  readonly bestsellers: boolean;

  @IsNotEmpty()
  readonly new: boolean;

  @IsNotEmpty()
  readonly category: string;

  soldCount: number;

  discount: number;
}
