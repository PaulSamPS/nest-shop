import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from '@/modules/profile/model/profile.model';
import { ProfileDto } from '@/modules/profile/dto/profile.dto';
import { UserDto } from '@/modules/user/dto/user.dto';
import { FileElementResponse } from '@/modules/files/dto/file-element-response.response';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile) private readonly profileRepository: typeof Profile,
  ) {}
  async create(
    user: UserDto,
    profileDto: ProfileDto,
    file: FileElementResponse[],
  ) {
    const profile = {
      user: user.id,
      firstname: profileDto.firstname,
      lastname: profileDto.lastname,
      avatar: JSON.stringify(file),
      country: profileDto.country,
      region: profileDto.region,
      city: profileDto.city,
    };

    await this.profileRepository.create(profile);

    return profile;
  }
}
