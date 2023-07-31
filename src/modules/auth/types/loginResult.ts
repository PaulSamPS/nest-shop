import { User } from '@/modules/user';

export class LoginResultDto {
  readonly user: User;
  readonly token: string;
  readonly message: string;
}
