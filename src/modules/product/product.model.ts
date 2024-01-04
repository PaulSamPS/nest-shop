import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Review } from '@/modules/review/review.model';
import { Features } from '@/modules/features/features.model';

@Table
export class Product extends Model {
  @HasMany(() => Review, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  review: Review;

  @HasOne(() => Features, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  features: Features;

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

  @Column({ type: DataType.DOUBLE, defaultValue: 0 })
  rating: number;

  @Column
  category: string;
}
