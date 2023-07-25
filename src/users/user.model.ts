import { Column, DataType, Model, Table } from 'sequelize-typescript';

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
}
