import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 1000 })
  @IsNotEmpty()
  readonly price: number;

  @ApiProperty({ example: 'Стул Dean' })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'Описание' })
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({ example: 'Изображение товара' })
  @IsNotEmpty()
  readonly images: string;

  @ApiProperty({ example: '510x440x850 мм' })
  @IsNotEmpty()
  readonly dimensions: string;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  readonly in_stock: number;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  readonly bestsellers: boolean;

  @ApiProperty({ example: false })
  @IsNotEmpty()
  readonly new: boolean;

  @ApiProperty({ example: 'Рейтинг, при создании 0' })
  readonly rating: number;

  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  readonly weight: number;

  @ApiProperty({ example: 'Бук' })
  readonly frame_material: string;

  @ApiProperty({ example: 400 })
  readonly legs_material: number;

  @ApiProperty({ example: 400 })
  readonly backrest_height: number;

  @ApiProperty({ example: 400 })
  readonly seat_height: number;

  @ApiProperty({ example: 400 })
  readonly seat_depth: number;

  @ApiProperty({ example: 400 })
  readonly seat_width: number;

  @ApiProperty({ example: 12 })
  @IsNotEmpty()
  readonly warranty_period: number;

  @ApiProperty({ example: 'Россия' })
  @IsNotEmpty()
  readonly country_of_manufacture: string;
}
