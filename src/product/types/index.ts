import { ApiProperty } from '@nestjs/swagger';

export class CreateProductRequest {
  @ApiProperty({ example: 5500 })
  price: number;

  @ApiProperty({ example: 'Dean' })
  name: string;

  @ApiProperty({ example: 'Описание' })
  description: string;

  @ApiProperty({ example: 'Изображения продукта' })
  images: string;

  @ApiProperty({ example: '70х80х120' })
  dimensions: string;

  @ApiProperty({ example: 10 })
  in_stock: number;

  @ApiProperty({ example: true })
  bestsellers: boolean;

  @ApiProperty({ example: false })
  new: boolean;

  @ApiProperty({ example: 0 })
  rating: number;

  @ApiProperty({ example: '5.5' })
  weight: string;

  @ApiProperty({ example: 'Фанера' })
  frame_material: string;

  @ApiProperty({ example: 'Бук' })
  legs_material: number;

  @ApiProperty({ example: 500 })
  backrest_height: number;

  @ApiProperty({ example: 400 })
  seat_height: number;

  @ApiProperty({ example: 550 })
  seat_depth: number;

  @ApiProperty({ example: 600 })
  seat_width: number;

  @ApiProperty({ example: 12 })
  warranty_period: number;

  @ApiProperty({ example: 'Россия' })
  country_of_manufacture: string;
}

export class CreateProductResponse {
  @ApiProperty({
    example: 25000,
  })
  price: number;

  @ApiProperty({
    example: 10,
  })
  in_stock: number;

  @ApiProperty({
    example: false,
  })
  bestsellers: boolean;

  @ApiProperty({
    example: false,
  })
  new: boolean;

  @ApiProperty({
    example: 0,
  })
  rating: number;

  @ApiProperty({
    example: '5.5',
  })
  weight: string;

  @ApiProperty({
    example: 'Россия',
  })
  country_of_manufacture: string;

  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'Bob',
  })
  name: string;

  @ApiProperty({
    example:
      'У нас не всегда получаеться написать красивое описания к каждому стулу',
  })
  description: string;

  @ApiProperty({
    example: '70x70',
  })
  dimensions: string;

  @ApiProperty({
    example:
      '[{"url":"/static/Bob/044191c361179d10fc28112f76e8b20e.webp","name":"044191c361179d10fc28112f76e8b20e.webp"},{"url":"/static/Bob/db51dae53696d52c7245db2c05779460.webp","name":"db51dae53696d52c7245db2c05779460.webp"}]',
  })
  images: string;

  @ApiProperty({
    example: '2023-05-17T06:39:02.484Z',
  })
  updatedAt: string;

  @ApiProperty({
    example: '2023-05-17T06:39:02.484Z',
  })
  createdAt: number;

  @ApiProperty({
    example: 'frame_material',
  })
  frame_material: string;

  @ApiProperty({
    example: 'бук',
  })
  legs_material: string;

  @ApiProperty({
    example: 500,
  })
  backrest_height: number;

  @ApiProperty({
    example: 400,
  })
  seat_height: number;

  @ApiProperty({
    example: 500,
  })
  seat_depth: number;

  @ApiProperty({
    example: 500,
  })
  seat_width: number;
}

export class PaginateAndFiltersResponse {
  @ApiProperty({ example: 10 })
  count: number;
  @ApiProperty({ type: CreateProductRequest, isArray: true })
  rows: CreateProductResponse[];
}

class BestSellers extends CreateProductResponse {
  @ApiProperty({ example: true })
  bestsellers: boolean;
}

export class BestSellersResponse {
  @ApiProperty({ example: 10 })
  count: number;
  @ApiProperty({ type: CreateProductRequest, isArray: true })
  rows: BestSellers;
}

class New extends CreateProductResponse {
  @ApiProperty({ example: true })
  new: boolean;
}

export class NewResponse {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ type: CreateProductRequest, isArray: true })
  rows: New;
}

export class SearchRequest extends CreateProductResponse {
  @ApiProperty({ example: 'Dean' })
  search: string;
}
export class SearchResponse extends CreateProductResponse {}

export class GetByNameRequest extends CreateProductResponse {
  @ApiProperty({ example: 'Dean' })
  name: string;
}
export class GetByNameResponse extends CreateProductResponse {}

export class FindOneResponse extends CreateProductResponse {}

export interface IProductsQuery {
  limit: string;
  offset: string;
}
