import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '@/modules/user';

@Table
export class Profile extends Model {
  @ForeignKey(() => User)
  user: User;

  @Column({ type: DataType.JSONB })
  avatar;

  @Column
  firstname: string;

  @Column
  lastname: string;

  @Column
  middleName: string;

  @Column
  phoneNumber: string;

  @Column
  country: string;

  @Column
  region: string;

  @Column
  city: string;

  @Column
  address: string;
}
