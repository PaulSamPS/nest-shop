import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '@/modules/user';
import { Product } from '@/modules/product/product.model';

@Table
export class Review extends Model {
  @ForeignKey(() => User)
  user: User;

  @ForeignKey(() => Product)
  product: number;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column
  rating: number;

  @Column({ type: DataType.TEXT })
  review: string;

  @Column({ defaultValue: false })
  approved: boolean;
}
