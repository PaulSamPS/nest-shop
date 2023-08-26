import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '@/modules/user';
import { DataTypes } from 'sequelize';

@Table
export class ShoppingCart extends Model {
  @ForeignKey(() => User)
  user: User;

  @Column({
    type: DataTypes.ARRAY(DataTypes.JSONB),
    allowNull: true,
    defaultValue: [],
    get() {
      const data = this.getDataValue('products');
      const toSend = [];
      data.forEach((val) => {
        toSend.push(typeof val === 'string' ? JSON.parse(val) : val);
      });
      return toSend;
    },
  })
  products;

  @Column({ defaultValue: 0 })
  total_price: number;
}
