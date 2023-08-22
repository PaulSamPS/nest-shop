import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '@/modules/user';

@Table
export class Profile extends Model {
  @ForeignKey(() => User)
  user: User;

  @Column
  avatar: string;

  @Column
  firstname: string;

  @Column
  lastname: string;

  @Column
  country: string;

  @Column
  region: string;

  @Column
  city: string;

  @Column
  address: string;
}
