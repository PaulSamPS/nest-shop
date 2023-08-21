import * as bcrypt from 'bcrypt';
import { User, UserService } from 'src/modules/user';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import * as crypto from 'crypto';
import { RedirectInterceptor } from '@/config/redirectInterceptor';
import { MailService } from '@/modules/mail/mail.service';
import { AppError } from '@/common/constants/appError';
import { AppMessage } from '@/common/constants/appMessage';
import { TokenService } from '@/modules/token/token.service';
import { LoginResultDto } from '@/modules/auth/types/loginResult';
import { ConfigService } from '@nestjs/config';
import { AuthUserDto } from '@/modules/auth/dto/authUserDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  async login(authUserDto: AuthUserDto): Promise<LoginResultDto> {
    const existUser = await this.userService.findOne({
      where: { email: authUserDto.email },
    });

    if (!existUser) {
      throw new HttpException(AppError.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
    }

    const passwordValid = await bcrypt.compare(
      authUserDto.password,
      existUser.password,
    );

    if (!passwordValid) {
      throw new HttpException(
        AppError.INCORRECT_PASSWORD,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!existUser.isActivated) {
      throw new HttpException(
        AppError.ACCOUNT_NOT_ACTIVATED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userService.findOnePublic({
      where: { email: existUser.email },
    });
    const token = await this.tokenService.generateJwtToken(user);

    return {
      user,
      token,
      message: AppMessage.LOGGED_IN,
    };
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
      `${this.configService.get('base_url')}/activate/${activationLink}`,
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

    return new RedirectInterceptor(
      `${this.configService.get('base_url')}/auth/login`,
    );
  }
}
