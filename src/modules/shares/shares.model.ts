import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Shares extends Model {
  @Column({ type: DataType.JSONB })
  images;

  @Column
  name: string;

  @Column
  path: string;
}
