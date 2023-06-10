import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  findOne(filter: {
    where: {
      id?: number;
      email?: string;
      phone?: string;
    };
  }): Promise<User> {
    return this.userModel.findOne({ ...filter });
  }
}
