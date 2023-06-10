import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Product extends Model {
  @Column({ defaultValue: 0 })
  price: number;

  @Column
  name: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.TEXT })
  images: string;

  @Column
  dimensions: string;

  @Column({ defaultValue: 0 })
  in_stock: number;

  @Column({ defaultValue: false })
  bestseller: boolean;

  @Column({ defaultValue: false })
  new: boolean;

  @Column({ defaultValue: 0 })
  rating: number;

  @Column({ defaultValue: '0' })
  weight: string;

  @Column
  frame_material: string;

  @Column
  legs_material: number;

  @Column
  backrest_height: number;

  @Column
  seat_height: number;

  @Column
  seat_depth: number;

  @Column
  seat_width: number;

  @Column
  warranty_period: number;

  @Column({ defaultValue: 'Россия' })
  country_of_manufacture: string;
}
