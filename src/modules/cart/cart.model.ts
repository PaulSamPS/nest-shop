import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '@/modules/user';
import { DataTypes } from 'sequelize';

@Table
export class Cart extends Model {
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

  @Column({ defaultValue: 0 })
  discount: number;
}
