import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '@/modules/user';
import { DataTypes } from 'sequelize';

@Table
export class Order extends Model {
  @ForeignKey(() => User)
  user: User;

  @Column({
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  })
  products;

  @Column
  total_price: number;

  @Column
  discount: number;

  @Column
  status: string;

  @Column
  orderId: string;

  @Column({
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  })
  userInfo;
}
