import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@users';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(phone: string) {
    const user = await this.userService.findOne({ where: { phone } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      userId: user.id,
      phone: user.phone,
      username: user.username,
      email: user.email,
    };
  }
}
