import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { MailService } from '@/modules/mail/mail.service';
import { RedirectInterceptor } from '@/config/redirectInterceptor';
import * as crypto from 'crypto';
import { AppMessage } from '@/common/constants/appMessage';
import { AppError } from '@/common/constants/appError';
import { ConfigService } from '@nestjs/config';
import { Profile } from '@/modules/profile/model/profile.model';
import { Cart } from '@/modules/cart/cart.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  findOne(filter: {
    where: {
      id?: number;
      username?: string;
      email?: string;
      resetPasswordToken?: string;
      activationLink?: string;
    };
  }): Promise<User> {
    return this.userModel.findOne({ ...filter });
  }

  exclude = [
    'password',
    'activationLink',
    'resetPasswordToken',
    'resetPasswordTokenExp',
    'isActivated',
  ];
  findOnePublic(filter: {
    where: {
      id?: number;
      username?: string;
      email?: string;
      resetPasswordToken?: string;
      activationLink?: string;
    };
  }): Promise<User> {
    return this.userModel.findOne({
      ...filter,
      attributes: {
        exclude: this.exclude,
      },
    });
  }

  async sendResetPasswordLink(createUserDto: CreateUserDto) {
    const findUser = await this.findOne({
      where: { email: createUserDto.email },
    });

    if (!findUser) {
      return new ForbiddenException(AppError.USER_EMAIL_NOT_EXIST);
    }

    const token = crypto.randomBytes(32).toString('hex');

    findUser.resetPasswordToken = token;
    findUser.resetPasswordTokenExp = String(Date.now() + 60 * 60 * 1000);
    await findUser.save();

    await this.mailService.sendResetLink(
      createUserDto.email,
      `${this.configService.get(
        'base_url',
      )}/users/check-password-token/${token}`,
    );

    return { message: AppMessage.LINK_HAS_BEEN_SENT };
  }

  async checkResetPasswordToken(resetPasswordToken: string) {
    const user = await this.findOne({
      where: { resetPasswordToken: resetPasswordToken },
    });

    if (!user) {
      throw new HttpException(AppError.USER_NOT_FOUND, HttpStatus.FORBIDDEN);
    }

    if (user && new Date(user.resetPasswordTokenExp) > new Date()) {
      throw new HttpException(
        AppError.LINK_HAS_BEEN_EXPIRED,
        HttpStatus.FORBIDDEN,
      );
    }

    return new RedirectInterceptor(
      `${this.configService.get('base_url')} + /password-change`,
    );
  }
}
