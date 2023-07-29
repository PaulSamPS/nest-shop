import * as bcrypt from 'bcrypt';
import { User, UserService } from 'src/modules/user';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import * as crypto from 'crypto';
import * as process from 'process';
import { RedirectInterceptor } from '@/config/redirectInterceptor';
import { MailService } from '@/modules/mail/mail.service';
import { UserDto } from '@/modules/user/dto/user.dto';
import { AppError } from '@/common/constants/appError';
import { AppMessage } from '@/common/constants/appMessage';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDto | HttpException> {
    const user = await this.userService.findOne({ where: { username } });

    if (!user) {
      throw new HttpException(AppError.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new HttpException(
        AppError.INCORRECT_PASSWORD,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!user.isActivated) {
      throw new HttpException(
        AppError.ACCOUNT_NOT_ACTIVATED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user && passwordValid) {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        isActivated: user.isActivated,
      };
    }

    return null;
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string } | HttpException> {
    const user = new User();

    const existingByUsername = await this.userService.findOne({
      where: { username: createUserDto.username },
    });

    if (existingByUsername) {
      throw new HttpException(AppError.USERNAME_EXIST, HttpStatus.BAD_REQUEST);
    }

    const existingByUserEmail = await this.userService.findOne({
      where: { email: createUserDto.email },
    });

    if (existingByUserEmail) {
      throw new HttpException(
        AppError.USER_EMAIL_EXIST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const activationLink = crypto.randomBytes(32).toString('hex');

    user.password = await bcrypt.hash(createUserDto.password, 10);
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.activationLink = activationLink;
    await user.save();

    await this.mailService.sendActivationLink(
      createUserDto.email,
      `${process.env.BASE_URL}/activate/${activationLink}`,
    );

    return {
      message: AppMessage.ACTIVATION_LINK_SENT,
    };
  }

  async activateAccount(
    activationLink: string,
  ): Promise<RedirectInterceptor | HttpException> {
    const user = await this.userService.findOne({
      where: { activationLink: activationLink },
    });

    if (!user) {
      throw new HttpException(AppError.INCORRECT_LINK, HttpStatus.BAD_REQUEST);
    }

    user.isActivated = true;
    user.activationLink = null;
    await user.save();

    return new RedirectInterceptor(`${process.env.BASE_URL}/auth/login`);
  }
}
