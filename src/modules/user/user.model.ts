import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Profile } from '@/modules/profile/model/profile.model';

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

  @HasMany(() => Profile, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  profile: Profile[];
}
