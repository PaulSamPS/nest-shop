import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Product extends Model {
  @Column({ defaultValue: 0 })
  price: number;

  @Column({ defaultValue: 0 })
  oldPrice: number;

  @Column
  name: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.JSONB })
  images;

  @Column({ defaultValue: 0 })
  in_stock: number;

  @Column({ defaultValue: false })
  bestseller: boolean;

  @Column({ defaultValue: false })
  new: boolean;

  @Column({ defaultValue: 0 })
  soldCount: number;

  @Column
  category: string;
}
