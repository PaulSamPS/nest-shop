import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class IpAddress extends Model {
  @Column
  ip: string;

  @Column({ defaultValue: 5 })
  attempts: number;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
