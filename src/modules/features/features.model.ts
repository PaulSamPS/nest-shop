import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from '@/modules/product/product.model';

@Table
export class Features extends Model {
  @Column
  productName: string;

  @Column({ type: DataType.JSONB })
  features;

  @ForeignKey(() => Product)
  product: number;
}
