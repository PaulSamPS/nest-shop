import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Furniture extends Model {
  @Column({ defaultValue: 0 })
  price: number;

  @Column
  name: string;

  @Column
  description: string;

  @Column
  images: string;

  @Column
  dimensions: string;

  @Column({ defaultValue: 0 })
  in_stock: number;

  @Column({ defaultValue: false })
  bestsellers: boolean;

  @Column({ defaultValue: false })
  new: boolean;

  @Column
  rating: number;

  @Column({ defaultValue: 0 })
  weight: number;

  @Column
  frame_material: string;

  @Column
  legs_material: string;

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
