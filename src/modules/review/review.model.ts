import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Review extends Model {
  @Column
  productName: string;

  @Column
  userId: number;

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
