import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class ShoppingCart extends Model {
  @Column
  userId: string;

  @Column
  productId: string;

  @Column({ defaultValue: 0 })
  price: number;

  @Column
  name: string;

  @Column
  image: string;

  @Column({ defaultValue: 0 })
  in_stock: number;

  @Column({ defaultValue: 0 })
  weight: number;

  @Column({ defaultValue: 0 })
  count: number;

  @Column({ defaultValue: 0 })
  total_price: number;
}
