import {
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Profile } from '@/modules/profile/model/profile.model';
import { Cart } from '@/modules/cart/cart.model';
import { Review } from '@/modules/review/review.model';
import { Order } from '@/modules/order/order.model';
import { Favourites } from '@/modules/favourites/favourites.model';

@Table
export class User extends Model {
  @Column
  username: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column({ type: DataType.TEXT })
  activationLink: string;

  @Column({ type: DataType.TEXT })
  resetPasswordToken: string;

  @Column
  resetPasswordTokenExp: string;

  @Column({ defaultValue: false })
  isActivated: boolean;

  @HasOne(() => Profile, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  profile: Profile;

  @HasOne(() => Cart, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  shoppingCart: Cart;

  @HasMany(() => Review, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  reviews: Review;

  @HasMany(() => Order, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  orders: Order;

  @HasMany(() => Favourites, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  favourites: Favourites;
}
