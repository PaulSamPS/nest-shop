import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UsersService } from '@users';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateUser(
    phone: string,
  ): Promise<{ userId: number; phone: string; email: string }> {
    const user: User = await this.userService.findOne({ where: { phone } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      userId: user.id,
      phone: user.phone,
      email: user.email,
    };
  }
}
