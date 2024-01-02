import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Features extends Model {
  @Column
  productName: string;

  @Column({ type: DataType.JSONB })
  features;
}
