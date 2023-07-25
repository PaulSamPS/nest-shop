import * as bcrypt from 'bcrypt';
import { User, UserService } from '@users';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as crypto from 'crypto';
import * as process from 'process';
import { RedirectInterceptor } from '../config/redirectInterceptor';
import { MailService } from '../mail/mail.service';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserDto> {
    const user = await this.userService.findOne({ where: { username } });

    if (!user) {
      throw new HttpException(
        'Пользователь не найден',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new HttpException('Неверный пароль', HttpStatus.UNAUTHORIZED);
    }

    if (!user.isActivated) {
      throw new HttpException(
        'Аккаунт не активирован',
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
  ): Promise<User | { warningMessage: string } | { msg: string }> {
    const user = new User();

    const existingByUsername = await this.userService.findOne({
      where: { username: createUserDto.username },
    });

    if (existingByUsername) {
      return { warningMessage: 'Пользователь с таким именем уже существует' };
    }

    const existingByUserEmail = await this.userService.findOne({
      where: { email: createUserDto.email },
    });

    if (existingByUserEmail) {
      return { warningMessage: 'Пользователь с таким email уже существует' };
    }

    const activationLink = crypto.randomBytes(32).toString('hex');

    user.password = await bcrypt.hash(createUserDto.password, 10);
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.activationLink = activationLink;
    await user.save();

    await this.mailService.sendActivationLink(
      createUserDto.email,
      `${process.env.API_URL}/activate/${activationLink}`,
    );

    return { msg: 'Ссылка для активации отправлена на указанный вами email' };
  }

  async activateAccount(activationLink: string) {
    const user = await this.userService.findOne({
      where: { activationLink: activationLink },
    });

    if (!user) {
      throw new HttpException('Некорректная ссылка', HttpStatus.FORBIDDEN);
    }

    user.isActivated = true;
    user.activationLink = null;
    await user.save();

    return new RedirectInterceptor(`${process.env.API_URL} + /login`);
  }
}
