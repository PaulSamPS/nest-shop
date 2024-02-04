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
  async update(userId: number, profileDto: ProfileDto) {
    const existingProfile = await this.profileModel.findOne({
      where: { user: userId },
    });

    if (!existingProfile) {
      const newProfile = {
        user: userId,
        firstname: profileDto.firstname,
        lastname: profileDto.lastname,
        middleName: profileDto.middleName,
        phoneNumber: profileDto.phoneNumber,
        region: profileDto.region,
        city: profileDto.city,
        address: profileDto.address,
      };

      return await this.profileModel.create(newProfile);
    }

    existingProfile.firstname = profileDto.firstname;
    existingProfile.lastname = profileDto.lastname;
    existingProfile.middleName = profileDto.middleName;
    existingProfile.phoneNumber = profileDto.phoneNumber;
    existingProfile.region = profileDto.region;
    existingProfile.city = profileDto.city;
    existingProfile.address = profileDto.address;
    await existingProfile.save();

    return existingProfile;
  }

  async avatar(file: FileElementResponse, userId: number) {
    const existingProfile = await this.profileModel.findOne({
      where: { user: userId },
    });

    if (!existingProfile) {
      const newProfile = {
        user: userId,
        firstname: null,
        lastname: null,
        middleName: null,
        phoneNumber: null,
        avatar: file,
        country: null,
        region: null,
        city: null,
      };

      return await this.profileModel.create(newProfile);
    }

    existingProfile.avatar = file;
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

  async deleteAvatar(userId: number) {
    const existingProfile = await this.profileModel.findOne({
      where: { user: userId },
    });

    if (!existingProfile) {
      return null;
    }

    existingProfile.avatar = null;
    await existingProfile.save();

    return existingProfile;
  }
}
