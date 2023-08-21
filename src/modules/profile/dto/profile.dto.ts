import { IsString } from 'class-validator';

export class ProfileDto {
  @IsString()
  avatar: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  country: string;

  @IsString()
  region: string;

  @IsString()
  city: string;

  @IsString()
  address: string;
}
