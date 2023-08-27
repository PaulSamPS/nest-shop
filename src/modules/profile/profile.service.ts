import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from '@/modules/profile/model/profile.model';
import { ProfileDto } from '@/modules/profile/dto/profile.dto';
import { UserDto } from '@/modules/user/dto/user.dto';
import { FileElementResponse } from '@/modules/files/dto/file-element-response.response';
import * as fs from 'fs-extra';
import { path } from 'app-root-path';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile) private readonly profileModel: typeof Profile,
  ) {}
  async create(
    user: UserDto,
    profileDto: ProfileDto,
    file: FileElementResponse[],
  ) {
    const existingProfile = await this.profileModel.findOne({
      where: { user: user.id },
    });

    if (!existingProfile) {
      const newProfile = {
        user: user.id,
        firstname: profileDto.firstname,
        lastname: profileDto.lastname,
        avatar: JSON.stringify(file),
        country: profileDto.country,
        region: profileDto.region,
        city: profileDto.city,
      };

      return await this.profileModel.create(newProfile);
    }

    existingProfile.firstname = profileDto.firstname;
    existingProfile.lastname = profileDto.lastname;
    existingProfile.country = profileDto.country;
    existingProfile.region = profileDto.region;
    existingProfile.city = profileDto.city;
    existingProfile.avatar = JSON.stringify(file);
    existingProfile.address = profileDto.address;
    await existingProfile.save();

    return existingProfile;
  }
}
