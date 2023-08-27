import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '@/modules/user';
import { DataTypes } from 'sequelize';

@Table
export class ShoppingCart extends Model {
  @ForeignKey(() => User)
  user: User;

  @Column({
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  })
  products;

  @Column({ defaultValue: 0 })
  total_price: number;
}
