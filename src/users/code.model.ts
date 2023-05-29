import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Code extends Model {
  @Column
  phone: string;

  @Column
  code: number;
}
