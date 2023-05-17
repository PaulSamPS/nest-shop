import { ApiProperty } from '@nestjs/swagger';

export class CreateFurnitureRequest {
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

  @ApiProperty({ example: 5 })
  weight: number;

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

export class CreateFurnitureResponse {
  @ApiProperty({
    example: {
      price: 25000,
      in_stock: 10,
      bestsellers: true,
      new: true,
      rating: 0,
      weight: 5,
      country_of_manufacture: 'Россия',
      id: 25,
      name: 'Bob',
      description:
        'У нас не всегда получаеться написать красивое описания к каждому стулу, но мы выкладываем живые фото готовых изделий на которых Вы можете рассмотреть качество сделанной работы и почувствовать добрые чувства с которыми сделаны стулья на основе каркасов Konyshev. Мы единственная в России группа инженеров занимающаяся проектированием и производством каркасов для мягкой мебели.',
      dimensions: null,
      warranty_period: 12,
      images:
        '[{"url":"/static/Bob/044191c361179d10fc28112f76e8b20e.webp","name":"044191c361179d10fc28112f76e8b20e.webp"},{"url":"/static/Bob/db51dae53696d52c7245db2c05779460.webp","name":"db51dae53696d52c7245db2c05779460.webp"}]',
      updatedAt: '2023-05-17T06:39:02.484Z',
      createdAt: '2023-05-17T06:39:02.484Z',
      frame_material: 'фанера',
      legs_material: 'бук',
      backrest_height: 500,
      seat_height: 400,
      seat_depth: 600,
      seat_width: 550,
    },
  })
  furniture: {
    price: number;
    in_stock: number;
    bestsellers: boolean;
    new: boolean;
    rating: number;
    weight: number;
    country_of_manufacture: string;
    id: number;
    name: string;
    description: string;
    dimensions: string;
    warranty_period: number;
    images: string;
    updatedAt: string;
    createdAt: string;
    frame_material: string;
    legs_material: string;
    backrest_height: number;
    seat_depth: number;
    seat_width: number;
    seat_height: number;
  };
}
