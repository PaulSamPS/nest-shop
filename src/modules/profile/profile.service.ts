import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from '@/modules/profile/model/profile.model';
import { ProfileDto } from '@/modules/profile/dto/profile.dto';
import { FileElementResponse } from '@/modules/files/dto/file-element-response.response';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile) private readonly profileModel: typeof Profile,
  ) {}
  async create(
    userId: number,
    profileDto: ProfileDto,
    file?: FileElementResponse,
  ) {
    const existingProfile = await this.profileModel.findOne({
      where: { user: userId },
    });

    if (!existingProfile) {
      const newProfile = {
        user: userId,
        firstname: profileDto.firstname,
        lastname: profileDto.lastname,
        avatar: file,
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
    existingProfile.avatar = file;
    existingProfile.address = profileDto.address;
    await existingProfile.save();

    return existingProfile;
  }

  async get(userId: number) {
    const existingProfile = await this.profileModel.findOne({
      where: { user: userId },
    });

    if (!existingProfile) {
      return null;
    }

    return existingProfile;
  }
}
